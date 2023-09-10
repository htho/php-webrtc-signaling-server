// @ts-check
import { create, poll, requestCreate, send } from "./helpers";

fixture("api");

test("create returns a new box", async (t) => {
    const response = await t.request(create());

    await t.expect(response.status).eql(200);
    const {type, data} = await /** @type {any} */ (response.body);
    await t.expect(type).eql("created");
    await t.expect(data).typeOf("string");
});

test("send returns the amount of messages in a box", async (t) => {
    const boxId = await requestCreate(t);

    const response1 = await t.request(send(boxId, "Hello World!"));
    
    await t.expect(response1.status).eql(200);
    const body1 = await /** @type {any} */ (response1.body);
    await t.expect(body1.type).eql("ack");
    await t.expect(body1.data).eql(1);
    
    const response2 = await t.request(send(boxId, "Hello Again!"));

    await t.expect(response2.status).eql(200);
    const body2 = await /** @type {any} */ (response2.body);
    await t.expect(body2.type).eql("ack");
    await t.expect(body2.data).eql(2);
});

test("poll returns all received messages", async (t) => {
    const boxId = await requestCreate(t);

    await t.request(send(boxId, "Hello World!"));
    await t.request(send(boxId, "Hello Again!"));

    const response1 = await t.request(poll(boxId));

    await t.expect(response1.status).eql(200);
    const body1 = await /** @type {any} */ (response1.body);
    await t.expect(body1.type).eql("msgs");
    await t.expect(body1.data).eql([
        "Hello World!",
        "Hello Again!",
    ]);

    const response2 = await t.request(poll(boxId));
    console.log(response2)
    await t.expect(response2.status).eql(200);
    const body2 = await /** @type {any} */ (response2.body);
    await t.expect(body2.type).eql("msgs");
    await t.expect(body2.data).eql([]);
});

