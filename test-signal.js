const url = 'https://rmediatech.com/api/signal/tachyon';

async function testFormat(dataVal) {
    const payload = {
        type: 'offer',
        sessionId: 'tachyondeck-test',
        data: dataVal
    };
    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    console.log("Send data type:", typeof dataVal, "=> Response:", res.status);
}

async function run() {
    // 1. the pure offer object
    await testFormat({ type: 'offer', sdp: 'v=0...' });

    // 2. the stringified offer
    await testFormat(JSON.stringify({ type: 'offer', sdp: 'v=0...' }));
}

run();
