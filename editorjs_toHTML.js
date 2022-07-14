 
let convertedHtml = '';
let i = 0;

// Recursive function to infinite sublists
function recursive(items, typeList) {
  convertedHtml += `<${typeList}>`; // ul/ol tag

  items.forEach(function(item) {
    if (item.items.length > 0) {
      convertedHtml += `<li>${item.content}</li>`;
      recursive(item.items, typeList);
    } else {
      convertedHtml += `<li>${item.content}</li>`;
    }
  });

  convertedHtml += `</${typeList}>`;
  return convertedHtml;
}

// Get json-blocks from EditorJS 
function convertDataToHtml(blocks) {

  blocks.map(block => {
    if (typeof block.tunes!='undefined') {
        align = typeof block.tunes.anyTuneName!='undefined' ? typeof block.tunes.anyTuneName.alignment!='undefined' ? block.tunes.anyTuneName.alignment : '' : '';
        attr = typeof block.tunes.textVariant!='undefined' ? block.tunes.textVariant+" " : '';
    }
                
    
    switch (block.type) {
      case "paragraph":
        convertedHtml += `<p align="${align}" class="tool_paragraph ${attr}">${block.data.text}</p>`;
        break;

      case "header":
        convertedHtml += `<h${block.data.level} align="${align}" class="tool_header">${block.data.text}</h${block.data.level}>`;
        break;

      case "delimiter":
        convertedHtml += '<hr class="tool_delimiter" />';
        break;

      case "image":
        attr = '';
        attr += block.data ? 'stretched ' : '';
        attr += block.data ? 'withBackground ' : '';
        attr += block.data ? 'withBorder' : '';

        convertedHtml += `<img class="tool_image ${attr}" src="${block.data.file.url}" title="${block.data.caption}" alt="${block.data.caption}" />`;
        convertedHtml += `<br /><em>${block.data.caption}</em>`;
        break;

      case "embed":
        convertedHtml += `<div class="tool_embded">`;
          convertedHtml += `<iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
          convertedHtml += `<iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        convertedHtml += `</div>`;
        convertedHtml += `<em>${block.data.caption}</em>`;
        break;

      case "list":
        typeList = block.data.style=='ordered' ? 'ol' : 'ul';
        convertedHtml += recursive(block.data.items, typeList);
        break;

      case "checklist":
        convertedHtml += '<ul class="tool_checklist">';
          block.data.items.forEach(function(item) {
            attr = item.checked ? 'checked' : '';
            convertedHtml += `<li class="${attr}">${item.text}</li>`;
          });
        convertedHtml += "</ul>";
        break;

      case "table":
        convertedHtml += `<table>`;
            convertedHtml += `<tbody>`;
                if (block.data.withHeadings) {
                    convertedHtml += `<thead>`;
                        block.data.content[0].forEach(function(item) {
                            convertedHtml += `<th>${item}</th>`;
                        });
                    convertedHtml += `</thead>`;
                    i = 1;
                }

                for (i; i < block.data.content.length; ++i) {
                    convertedHtml += `<tr>`;
                        block.data.content[i].forEach(function(item) {
                                convertedHtml += `<td>${item}</td>`;
                        });
                    convertedHtml += `</tr>`;
                };
            convertedHtml += `</tbody>`;
        convertedHtml += `</table>`;
        console.log(convertedHtml);
        break;

      case "quote":
        convertedHtml += `<blockquote align="${block.data.alignment}">${block.data.text}</blockquote>`;
        convertedHtml += `<em>${block.data.caption}</em>`;
        break;

      case "warning":
        convertedHtml += `<div class="warning_embded" align="${block.data.alignment}">`;
          convertedHtml += `<p><strong>${block.data.title}</strong></p>`;
          convertedHtml += `<p>${block.data.message}</p>`;
        convertedHtml += `</div>`;
        break;

      default:
        console.error(">>> Unknown block type:", block.type);
        break;
    }
  });

  return convertedHtml;
}