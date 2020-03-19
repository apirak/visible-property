var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function propertyText() {
    const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
    return nodes.map(node => node);
}
function selectedNodeExist() {
    return figma.currentPage.selection.length != 0;
}
function firstSelectedNode() {
    // [TODO] Selected may not Rectangle Node
    return figma.currentPage.selection[0];
}
function colorNumberToHex(color) {
    var hex = Math.round(color * 255).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
;
function rgbToHex(r, g, b) {
    return "#" + colorNumberToHex(r) + colorNumberToHex(g) + colorNumberToHex(b);
}
;
function colorToHex(color) {
    return rgbToHex(color["r"], color["g"], color["b"]);
}
function setText(text, newCharacters) {
    return __awaiter(this, void 0, void 0, function* () {
        let font = text.fontName;
        yield figma.loadFontAsync({ family: font.family, style: font.style });
        text.characters = newCharacters;
    });
}
function addTextNearSelected(text, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let node = firstSelectedNode();
        yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        const textNode = figma.createText();
        textNode.fontSize = 12;
        textNode.fontName = { family: "Roboto", style: "Regular" };
        textNode.x = node.x;
        textNode.y = node.y + node.height + 20;
        textNode.characters = text;
        textNode.name = name;
        node.parent.appendChild(textNode);
    });
}
function updateUI() {
    let message = {};
    const countText = propertyText().length;
    message["countText"] = countText;
    if (selectedNodeExist()) {
        const selectedNode = firstSelectedNode();
        message["isSelected"] = true;
        // [TODO] consider fills and stroke may have more than one
        if (selectedNode.fills[0]) {
            message["fill"] = colorToHex(selectedNode.fills[0].color);
        }
        if (selectedNode.strokes[0]) {
            message["stroke"] = colorToHex(selectedNode.strokes[0]["color"]);
        }
    }
    else {
        message["isSelected"] = false;
    }
    figma.ui.postMessage(message);
}
function updateTextByFill(node, nodeId) {
    let selectedNode = figma.getNodeById(nodeId);
    if (selectedNode) {
        if (selectedNode.fills[0]) {
            const hexColor = colorToHex(selectedNode.fills[0]["color"]);
            setText(node, hexColor.toUpperCase());
        }
    }
}
function updateTextByStroke(node, nodeId) {
    let selectedNode = figma.getNodeById(nodeId);
    if (selectedNode) {
        if (selectedNode.strokes[0]) {
            const hexColor = colorToHex(selectedNode.strokes[0]["color"]);
            setText(node, hexColor.toUpperCase());
        }
    }
}
function updateAll() {
    const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
    nodes.forEach(node => {
        let names = node.name.split(" ");
        let nodeId = names[0].substring(1);
        // [TODO] learn regular expression from https://regexone.com (-_-)'
        // let nodeId = RegExp(/^#(.*)/).exec(names[0])[1]
        // RegExp(/(?:#)[^\s]*/).exec("#asdf 232")
        // let nodeId = RegExp(/^#(.*)/).exec(node.name);
        console.log("name:" + node.name);
        console.log("ID: " + nodeId);
        console.log("type: " + names[1]);
        if (names[1] == "stroke") {
            updateTextByStroke(node, nodeId);
        }
        else {
            updateTextByFill(node, nodeId);
        }
    });
}
figma.on("selectionchange", () => {
    updateUI();
});
figma.ui.onmessage = msg => {
    if (msg.type === 'update_all') {
        updateAll();
        figma.closePlugin();
    }
    if (msg.type === "add_fill") {
        const hexColor = colorToHex(firstSelectedNode().fills[0].color);
        const name = "#" + firstSelectedNode().id + " fill";
        addTextNearSelected(hexColor.toUpperCase(), name);
    }
    if (msg.type === "add_stroke") {
        const hexColor = colorToHex(firstSelectedNode().strokes[0]["color"]);
        const name = "#" + firstSelectedNode().id + " stroke";
        addTextNearSelected(hexColor.toUpperCase(), name);
    }
};
if (selectedNodeExist()) {
    figma.showUI(__html__);
    figma.ui.resize(250, 220);
    updateUI();
}
else {
    updateAll();
    figma.closePlugin();
}
