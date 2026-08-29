const ALLOWED_TAGS = new Set(["SPAN", "BR"]);
const ALLOWED_STYLE_PROPS = ["color", "font-size"];

const sanitizeNode = (node) => {
    Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) return;

        if (child.nodeType !== Node.ELEMENT_NODE || !ALLOWED_TAGS.has(child.tagName)) {
            // Unwrap anything unexpected rather than dropping its text, so a
            // pasted <div> still keeps its content.
            while (child.firstChild) node.insertBefore(child.firstChild, child);
            node.removeChild(child);
            return;
        }

        const keptStyles = ALLOWED_STYLE_PROPS
            .map((prop) => [prop, child.style.getPropertyValue(prop)])
            .filter(([, value]) => value);

        Array.from(child.attributes).forEach((attr) => child.removeAttribute(attr.name));
        keptStyles.forEach(([prop, value]) => child.style.setProperty(prop, value));

        sanitizeNode(child);
    });
};

export const sanitizeRichText = (html) => {
    const container = document.createElement("div");
    container.innerHTML = html;
    sanitizeNode(container);
    return container.innerHTML;
};

export const stripHtml = (html) => {
    const container = document.createElement("div");
    container.innerHTML = html;
    return container.textContent || "";
};