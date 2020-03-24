// Get property from Node
import { colorToHex } from './colorUtility';
import { UIInformation, NodeInfo } from '../types';
import { BasicNode, Rectangle, Component, nodeFactory} from './basicNode';

export function selectedFirstNode():BasicNode | Rectangle | Component {
  let node = figma.currentPage.selection[0];
  return nodeFactory(node.id);
}

export function isSelectedNodeExist():boolean {
  return figma.currentPage.selection.length != 0
}

export function searchVisiblePropertyTextNodes():TextNode[] {
  const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
  return nodes.map(node => <TextNode> node)
}

export function prepareValueForUI():UIInformation{
  const countText:number = searchVisiblePropertyTextNodes().length;

  let uiInformation:UIInformation = {countPropertyTexts: countText, isSelected: false};

  if (isSelectedNodeExist()) {
    uiInformation.isSelected = true;

    let selectedNode:BasicNode = selectedFirstNode();

    let nodeInfo:NodeInfo = {
      fillColor: selectedNode.getFill(),
      strokeColor: selectedNode.getStroke(),
      description: selectedNode.getDescription(),
    }
    
    uiInformation.selectedNode = nodeInfo;

  } else {
    uiInformation.isSelected = false;
  }
  return uiInformation;
}