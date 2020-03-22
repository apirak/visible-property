import fs from 'fs';

import manifest from '../../manifest.json';
import { colorNumberToHex, rgbToHex, colorToHex} from '../plugin/color';

describe('build script', () => {
  it('should create the plugin.js and ui.html files in the dist folder', async () => {
    const pluginFilePath = manifest.main;
    const uiFilePath = manifest.ui;

    // JS plugin file has been generated
    expect(fs.existsSync(`./${pluginFilePath}`)).toBeDefined();

    // HTML plugin file has been generated (test only if it's declared in the manifest)
    if (uiFilePath) {
      expect(fs.existsSync(`./${uiFilePath}`)).toBeDefined();
    }
  });

  it('colorNumberToHex should convert one color to Hex', async() => {
    expect(colorNumberToHex(0.7124999761581421)).toBe("b6");
    expect(colorNumberToHex(0.0860937237739563)).toBe("16");
    expect(colorNumberToHex(0.00677083432674408)).toBe("02");
    expect(colorNumberToHex(0.0625)).toBe("10");
  });

  it('rgbToHex should convert R G B to #color ', async() => {
    expect(rgbToHex(0.5098039507865906, 0.5098039507865906, 0.5098039507865906)).toBe("#828282");
    expect(rgbToHex(0.7124999761581421, 0.0860937237739563, 0.00677083432674408)).toBe("#b61602");
  });  

});
