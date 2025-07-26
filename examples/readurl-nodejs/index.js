import express from 'express';
import axios from 'axios';
import cors from 'cors';
import * as cheerio from 'cheerio';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/process-url', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extract Links
        const links = [];
        $('a').each((i, elem) => {
            const href = $(elem).attr('href');
            if (href) {
                links.push(href);
            }
        });

        // Filter Content
        let content = '';
        const mainEl = $('main').first();
        const articleEl = $('article').first();
        if (mainEl.length) {
            content = mainEl.text();
        } else if (articleEl.length) {
            content = articleEl.text();
        } else {
            $('script, style, header, footer, nav, aside, details, summary, svg, [role="banner"], [role="navigation"], [role="contentinfo"]').remove();
            content = $('body').text();
        }
        content = content.replace(/\s\s+/g, ' ').trim();

        res.send({ content, links });

    } catch (error) {
        res.status(500).send({ error: 'Failed to process the URL' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});