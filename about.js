$().ready(main);

function main() {
    for(let folder in projectImages) {
      console.log(projectImages[folder]);
      if(folder === 'about') {
        $('#about-img').append(new ResponsiveImg(projectImages[folder][0], {class: 'w-25'}));
      }
    }

}

/**
 * 
 ******************************************************
 * 
 *  Responsive Image
 * 
 * 
 */
function ResponsiveImg(imgData, opts) {
  let self        = this; 
  let thumbSrc    = imgData.thumb;
  let fallbackSrc = imgData.src;
  let alt         = imgData.alt;
  let srcset      = imgData.srcset;
  let _class      = opts && opts.class; 

  $imgContainer = $('<div>', {
      class: 'responsive-image-container ' + _class,
  });

  $img = $('<img>', {
      class: 'img-responsive', 
      src: fallbackSrc, 
      srcset: srcset, 
      alt: alt || '', 
  })
  
  // if(thumbSrc) {
  //     $thumb = $('<img>', {
  //         class: 'thumb-img', 
  //         src: imgData.thumb,
  //     });
  // } 
  $imgContainer.append($img); 
  return $imgContainer; 
}