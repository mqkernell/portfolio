//////////////////////////////////////////////// 
//
// Quinn Website
//
//
console.log(projectImages);
var buttonCategories = {
    'medium': [],
    'tags': [],
    'date': [], 
};
var activeFilters = {}
for(var cat in buttonCategories) {
    activeFilters[cat] = []; 
}

$().ready(main);

function main() {
    let overlayController = new OverlayController(); 
    let filterController  = new FilterController(); 

    filterController.addFilterButtons(buttonCategories); 

    /**
     *  Add Projects
     */
    let $projectSection = $('#projects');
    
    projects.forEach(function(project) {
        let $projectContainer = $('<a>', {
            href: "#" + encodeURI(project.name),
            class: "project-container p-2 w-50 active",
            data: getProjectTags(project)
        });
        
        $projectContainer.click(function() {
            overlayController.openProject(project); 
        });
        
        let coverImage = project.images.filter(function(img) {
            return img.is_cover
        })[0];

        // If there is a cover img in data, add it
        if(coverImage) {
            $projectContainer.append($('<img />', { 
                class: "cover-image", 
                src: './assets/' + project.image_base + "/" + coverImage.src,
                alt: project.alt || '', 
            })); 
        } 
        // Else pick the first from the transformed images
        else if(projectImages && projectImages[project.image_base] && projectImages[project.image_base][0]) {
            $projectContainer.append(new ResponsiveImg(projectImages[project.image_base][0], {class: 'cover-image'}))
        }
        // Else add a default image
        else {
            $projectContainer.append($('<div />', { 
                class: "cover-image placeholder-img", 
            }));
        }
        $projectSection.append($projectContainer); 
    });
}

/**
 * 
 */
function getProjectTags(project) {
    let tagsObject = {};  
    for (let category in buttonCategories) {
        if (project[category]) {
            let type = typeof(project[category]);
            if(type === 'string') {
                tagsObject[category] = [project[category]];
            }
            else {
                tagsObject[category] = project[category];
            }
        }
    }
    return tagsObject; 
}


/**
 * 
 ******************************************************
 * 
 *  Controller for the project overlay
 * 
 * 
 */
function OverlayController() {
    let self = this; 
    this.$containerEl   = $('#project-detail-container');
    this.$imagesEl      = $('#detail-images');
    this.$titleEl       = $('#detail-title');
    this.$descriptionEl = $('#detail-description');
    let $closeButton    = $('#detail-close-button');

    $(document).keyup(function(e) {
        self.hide();
    });

    // Hide
    $closeButton.click(function() {
        self.hide();
    });   
}

/**
 * 
 */
OverlayController.prototype.openProject = function(project) {
    this.clear();  
    this.$project = $(project);
    this.$imagesEl.append($('<h6>', {class: 'color-green'}).text('medium/ ' + project.medium));
    this.$imagesEl.append($('<h6>', {class: 'color-green'}).text('tags/ ' + project.tags.join(', ')));
    // Add images
    if(project.image_base && projectImages[project.image_base]) {
        
        let imagesData = projectImages[project.image_base]
        imagesData.forEach(imgData => {
            // console.log(new ResponsiveImg(imgData));
            this.$imagesEl.append(
                new ResponsiveImg(imgData, {class: 'detail-image my-4'})
            )
        })
    }
    // Add project description
    this.$titleEl.text(project.name); 
    this.$descriptionEl.text(project.description);
    this.show();  
}

/**
 * 
 */
OverlayController.prototype.clear = function() {
    this.$titleEl.empty(); 
    this.$imagesEl.empty();
    this.$descriptionEl.empty(); 
}

/**
 * 
 */
OverlayController.prototype.show = function() {
    this.$containerEl.addClass('active');
}

/**
 * 
 */
OverlayController.prototype.hide = function() {
    this.$containerEl.removeClass('active');
}




/**
 * 
 ******************************************************
 * 
 *  Conteroller for the filter buttons 
 * 
 * 
 */
function FilterController() {
    let self = this; 
    this.$buttonsSection = $('#buttons');

    $(document).keyup(function(e) {
        self.clear();
        self.applyFiltersToImages();
    });
}


/**
 * 
 */
FilterController.prototype.addFilterButtons = function(buttonCategories) {
    let self = this; 

    // Build array of filters per button category
    for (let category in buttonCategories) {
        projects.forEach(function (project) {
            if (project[category]) {
                let type = typeof (project[category]);
                if (type === 'string') {
                    buttonCategories[category].push(project[category]);
                }
                else if (type === 'object') {
                    project[category].forEach(function (val) {
                        buttonCategories[category].push(val);
                    });
                }
            }
        })
    }

    this.filterButtonData = buttonCategories; 

    // Build buttons based on the categories
    for (let category in buttonCategories) {
        $buttonSection = $('<div>', {
            class: 'px-3 py-1 my-3' + ' ' + category,
            role: 'group',
            id: category,
        });
        unique(buttonCategories[category]).forEach(value => {
            $buttonSection.append($('<button>', {
                class: 'filter-button btn btn-outline-light mr-2 mb-2',
                value: value,
                name: value,
                click: function() {
                    let $this = $(this);
                    self.updateFilters(value, category, !$this.hasClass('active'));
                    self.applyFiltersToImages(); 
                    $this.toggleClass('active'); 
                }, 
            }).text(value));
        });
        this.$buttonsSection.append($buttonSection);
    }
}

/**
 * 
 */
FilterController.prototype.updateFilters = function(value, category, isBecomingActive) {
    // $('#projects').animate({
    //     scrollTop: $(this).offset().top
    //   }, 1000);

    let prevActiveFilters   = activeFilters[category];

    // Either add or remove from active filters
    if(isBecomingActive) {
        prevActiveFilters.push(value); 
        activeFilters[category] = unique(prevActiveFilters);
    } 
    else {
        let newActiveFilters = $.grep(prevActiveFilters, function(val) {
            return val != value;
        });
        activeFilters[category] = unique(newActiveFilters);
    }
    console.log(activeFilters)
}

/**
 * 
 */
FilterController.prototype.applyFiltersToImages = function() {

    let self = this; 
    let $projectSection = $('#projects');
    $projectSection.children('.project-container').get().forEach(project => {
        $project = $(project); 

        
        let shouldBeActive = self.projectShouldBeActive($project.data(), activeFilters); 
        if(shouldBeActive) {
            $project.addClass('active'); 
            // $project.css('order', -1);
        } else {
            $project.removeClass('active'); 
            // $project.css('order', 0);
        }
    })
}

/**
 * 
 */
FilterController.prototype.projectShouldBeActive = function(projectFilters, activeFilters) {
    let active = true; 
    for(let cat in activeFilters) {
        activeFilters[cat].forEach(function(val) {
            // console.log(val, projectFilters[cat], $.inArray(val, projectFilters[cat]));

            if($.inArray(val, projectFilters[cat]) < 0) {
                active = false; 
            }
        });
    }
    return active; 
}

/**
 * 
 */
FilterController.prototype.clear = function() {
    $('.filter-button').removeClass('active');
    activeFilters = {}
    for(var cat in buttonCategories) {
        activeFilters[cat] = []; 
    }
}

/**
 * 
 */
function unique(array) {
    return $.grep(array, function(el, index) {
        return index === $.inArray(el, array);
    });
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