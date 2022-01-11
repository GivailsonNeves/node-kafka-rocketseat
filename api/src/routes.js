import express from 'express';

const routes = express.Router();

const valueData = {
    user: { id: 1, name: 'Givailson' },
    course: 'Kafka node',
    grade: 10
}

routes.post('/certifications', async (req, res) => {
    // console.log(req.producer)
    const kafkaResponse = await req.producer.send({
        topic: 'issue-certificate',
        messages: [
            {
                value: JSON.stringify(valueData),
            },
            {
                value: JSON.stringify({ ...valueData, user: { ...valueData.user, name: 'Diane' } }),
            }
        ],
    });

    return res.json({ ok: true, res: kafkaResponse });
});

export default routes;