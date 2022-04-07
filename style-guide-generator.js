const axios = require('axios');
const Color = require("./style-guide-models/colors");
const Typography = require("./style-guide-models/typography");
const Shadow = require("./style-guide-models/shadow");
const fs = require('fs');
axios.defaults.headers.common['X-Figma-Token'] = '352612-72a20a33-30c9-4e36-a583-61fda7c82a60';

// Make a request for a user with a given ID
axios.get('https://api.figma.com/v1/files/wxQL0dEZzRkOoluiA0CBj6/styles')
  .then(function (response) {
    const styles = response.data.meta.styles;
    const stylesColorsNodesId = styles
      .filter(style => style.style_type === 'FILL')
      .map(style => style.node_id);
    const stylesEffectsNodesId = styles
      .filter(style => style.style_type === 'EFFECT')
      .map(style => style.node_id);
    const stylesTextNodesId = styles
      .filter(style => style.style_type === 'TEXT')
      .map(style => style.node_id);

    Promise.all([
      axios.get(`https://api.figma.com/v1/files/wxQL0dEZzRkOoluiA0CBj6/nodes?ids=${stylesColorsNodesId.join(",")}`),
      axios.get(`https://api.figma.com/v1/files/wxQL0dEZzRkOoluiA0CBj6/nodes?ids=${stylesEffectsNodesId.join(",")}`),
      axios.get(`https://api.figma.com/v1/files/wxQL0dEZzRkOoluiA0CBj6/nodes?ids=${stylesTextNodesId.join(",")}`)
    ])
      .then(function (results) {
        const colors = getArrayOfNodes(results[0]).map(color => new Color(color));
        const effects = getArrayOfNodes(results[1]).map(font => new Shadow(font));
        const typographys = getArrayOfNodes(results[2]).map(font => new Typography(font));
        const mappedValues = {
          colors: {},
          effects: {},
          fonts: {},
        }

        colors.forEach(color => {
          mappedValues.colors[`${color.name}`] = color.cssColor
        })
        effects.forEach(shadow => {
          mappedValues.effects[`${shadow.name}`] = shadow.cssValue
        })
        typographys.forEach(font => {
          mappedValues.fonts[`${font.name}`] = font.cssValue
        })
        const jsonData = JSON.stringify(mappedValues);
        console.log(colors, colors[0].data.fills);
        fs.writeFile("figma-values.json", jsonData, function(err) {
          if (err) {
              console.log(err);
          }
        });
      });
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

function getArrayOfNodes(result) {
  const data = result.data.nodes
  const nodesArray = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      nodesArray.push({...data[key].document});
    }
  }
  return nodesArray;
}
