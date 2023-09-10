<?php

header("X-Accel-Buffering: no");
header("Cache-Control: no-cache");
header("Content-Type: application/json; charset=utf-8");

ini_set("session.use_only_cookies", false);
ini_set("session.use_cookies", false);
ini_set("session.use_trans_sid", false);
ini_set("session.cache_limiter", null);

$params = new Params($_GET);
$responder = new Responder();

session_id($params->boxid);
session_start();

if ($params->boxid == null) {
    // no boxid => new box
    $newboxid = session_id();
    $responder->created($newboxid);
    session_write_close();
    exit();
}
$msgQueue = new MessageQueue($_SESSION);

if ($params->msg != null) {
    // message available => store message
    $msgQueue->enqueue($params->msg);
    $responder->ack($msgQueue->count());
    session_write_close();
    exit();
}

$responder->msg($msgQueue->flush());
session_write_close();
exit();

class Responder
{
    public function ack(int $count): void
    {
        $this->response("ack", $count);
    }
    public function msg(array $msgs): void
    {
        $this->response("msgs", $msgs);
    }
    public function created(string $boxid): void
    {
        $this->response("created", $boxid);
    }

    private function response(string $response, mixed $data): void
    {
        print(json_encode(["type" => $response, "data" => $data]));
    }

}

class Params
{
    public string|null $boxid;
    public string|null $msg;

    public function __construct(array $get)
    {
        $this->boxid = $get["box"] ?? null;
        $this->msg = $get["msg"] ?? null;
    }
}

class MessageQueue
{
    public array $session;

    public function __construct(array & $session)
    {
        $this->session = & $session;

        if (!isset($this->session["msgs"])) {
            $this->session["msgs"] = [];
        }
    }
    public function enqueue(string $msg): void
    {
        array_push($this->session["msgs"], $msg);
    }
    public function flush(): array
    {
        $msgs = $this->session["msgs"];
        $this->session["msgs"] = [];
        return $msgs;
    }
    public function count(): int
    {
        return count($this->session["msgs"]);
    }
}
