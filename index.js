const Joi = require('joi');
const express = require("express");
const app = express();
app.use(express.json());

const categories = [
    { id: 1, name: "Fundamentals of programming" },
    { id: 2, name: "Fundamentals of algorithmization" },
    { id: 3, name: "Parallel programming" },
    { id: 4, name: "Computer graphics" }
];

app.get('/api/categories', (req, res) => {
    res.send(categories);
});

app.get('/api/categories/:id', (req, res) => {
    const lesson = categories.find(a => a.id === parseInt(req.params.id));
    if (!lesson)
        res.status(404).send('No textbook matching the given ID was found');
    res.send(lesson);
});

app.post('/api/categories', (req, res) => {
    const result = validated(req.body);
    if (result.error)
        return res.status(400).send(result.error.details[0].message);

    const newLesson = {
        id: categories.length + 1,
        name: req.body.name
    };
    categories.push(newLesson);
    res.status(201).send(newLesson);
});

app.put('/api/categories/:id', (req, res) => {
    const lesson = categories.find(a => a.id === parseInt(req.params.id));
    if (!lesson)
        res.status(404).send('No textbook matching the given ID was found');

    const result = validated(req.body);
    if (result.error)
        return res.status(400).send(result.error.details[0].message);

    lesson.name = req.body.name;
    res.send(lesson);
});
function validated(lesson) {
    const lessonSchema = Joi.object({
        name: Joi.string().required().min(3)
    });
    return lessonSchema.validate(lesson);
}

app.delete('/api/categories/:id', (req, res) => {
    const lesson = categories.find(a => a.id === parseInt(req.params.id));
    if(!lesson)
        return res.status(404).send('Berilgan ID ga teng darslik topilmadi');

    const index = categories.indexOf(lesson);
    categories.splice(index, 1);
    res.send(lesson);
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`${port} th port read`);
});
