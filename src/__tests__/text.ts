import fs from 'fs';

import manifest from '../../manifest.json';
import { matchName } from '../plugin/textUtility';

describe('text Utility', () => {
  it('Expect Matching', async() => {
    expect(matchName("#12 fill")).toMatchObject({id:"12", type:"fill"});
    expect(matchName("#12:23 fill")).toMatchObject({id:"12:23", type:"fill"});
    expect(matchName("#12:23 stroke")).toMatchObject({id:"12:23", type:"stroke"});

    // Defalut is fill
    expect(matchName("#12:23")).toMatchObject({id:"12:23", type:"fill"});

    // Don't Match
    expect(matchName("12:23")).toMatchObject({id:"", type:""});
    expect(matchName("12 #12:23 stroke")).toMatchObject({id:"12:23", type:"stroke"});
  });

  it('Expect default', async() => {
    // Defalut is fill
    expect(matchName("#12:23")).toMatchObject({id:"12:23", type:"fill"});

    // Don't Match
    expect(matchName("12:23")).toMatchObject({id:"", type:""});
    expect(matchName("12 #12:23 stroke")).toMatchObject({id:"12:23", type:"stroke"});
  });

  it('Expect not match', async() => {
    // Don't Match
    expect(matchName("12:23")).toMatchObject({id:"", type:""});
    expect(matchName("12 #12:23 stroke")).toMatchObject({id:"12:23", type:"stroke"});
  });
});
