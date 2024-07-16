import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import xss from 'xss'
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const handleComment = async (req,res) =>{
    try {
        const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='XSS'`
        function escapeHtml(str) {
            return str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        if (setting.status === 'Medium'){
            const blacklistedTags = [
                'a', 'a2', 'abbr', 'acronym', 'address', 'animate', 'animatemotion', 'animatetransform', 'applet', 'area', 'article', 
                'aside', 'audio', 'audio2', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'br', 'button', 'canvas', 'caption', 
                'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'custom', 'tags', 'data', 'datalist', 'dd', 'del', 
                'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 
                'footer', 'form', 'frame', 'frameset', 'h1', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'iframe2', 'image', 
                'image2', 'image3', 'img', 'img2', 'input', 'input2', 'input3', 'input4', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 
                'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nextid', 
                'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 
                'plaintext', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'set', 
                'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 
                'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 
                'var', 'video', 'video2', 'wbr', 'xmp'
            ];
            function filterBlacklist(input) {
                const tagPattern = new RegExp(`<\\/?(${blacklistedTags.join('|')})(\\s[^>]*)?>`, 'gi');
                return input.replace(tagPattern, match => escapeHtml(match));
            }
            await prisma.$queryRaw`
            INSERT INTO \"post_comment\" (authorid, postid, content) VALUES (${req.decoded.id}, ${req.body.postid}, ${filterBlacklist(req.body.content)})`
        }
        else {
            const window = new JSDOM('').window;
            const DOMPurify = createDOMPurify(window);
            await prisma.$queryRaw`
            INSERT INTO \"post_comment\" (authorid, postid, content) VALUES (${req.decoded.id}, ${req.body.postid}, ${DOMPurify.sanitize(xss(req.body.content))})`
        }
        
    } catch (error) {
        console.error("Error: ", error.message);
    }
}

export default {handleComment}