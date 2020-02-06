//////////////////////////////////////////////// 
//
// Quinn Website
//
//

var buttonCategories = {
    'medium': [],
    'tags': [],
    'date': [], 
};
var activeFilters = {}
for(var cat in buttonCategories) {
    activeFilters[cat] = []; 
}

$().ready(Main);

function Main() {
    let overlayController = new OverlayController(); 

    console.log(this.overlayController)
    addFilterButtons(buttonCategories); 
    
    
    /**
     *  Add Projects
     */
    let $projectSection = $('#projects');
    
    projects.forEach(function(project) {
        let $projectContainer = $('<div>', {
            class: "project-container active",
            data: getProjectTags(project)
        });
        
        $projectContainer.click(function() {
            overlayController.openProject(project); 
        });
        
        let coverImage = project.images.filter(function(img) {
            return img.is_cover
        })[0];

        if(coverImage) {
            $projectContainer.append($('<img />', { 
                class: "cover-image", 
                src: './assets/' + project.image_base + "/" + coverImage.src,
                alt: project.alt || '', 
            })); 
        }
        $projectSection.append($projectContainer); 
    });
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
    
    // Add images
    project.images.forEach(img => {
        this.$imagesEl.append($('<img />', { 
            class: "detail-image", 
            src: './assets/' + project.image_base + "/" + img.src,
            alt: img.alt || '', 
        })); 
    })

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

}

FilterController.prototype.clearFilters = function() {
    activeFilters = {};
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
 */
function addFilterButtons(buttonCategories) {
    let $buttonsSection = $('#buttons');

    for (let category in buttonCategories) {
        projects.forEach(function (project) {
            // If the project has the section field defined (eg. project[date]), add that button
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

    for (let category in buttonCategories) {
        $buttonSection = $('<div>', {
            class: 'button-section ' + category,
            id: category,
        });

        unique(buttonCategories[category]).forEach(value => {
            $buttonSection.append($('<button>', {
                class: 'filter-button btn-default btn-m',
                id: '',
                value: value,
                name: value,
                click: function() {
                    let $this = $(this);
                    onFilterButtonClick(value, category, !$this.hasClass('active'));
                    $this.toggleClass('active'); 
                }, 
            }).text(value));

        });
        
        $buttonsSection.append($buttonSection);
        $buttonsSection.append('<br>')            
    }
}

/**
 * 
 */
function onFilterButtonClick(value, category, isBecomingActive) {
    // Add to active filters
    if(isBecomingActive) {
        let prevActiveFilters   = activeFilters[category];
        prevActiveFilters.push(value); 
        activeFilters[category] = unique(prevActiveFilters);
        filterImages();
    } 
    // Remove from active filters
    else {
        let prevActiveFilters   = activeFilters[category];
        let newActiveFilters    = $.grep(prevActiveFilters, function(val) {
            return val != value;
        });
        activeFilters[category] = unique(newActiveFilters);
        filterImages();
    }
}


/**
 * 
 */
function filterImages() {
    let $projectSection = $('#projects');
    $projectSection.children('.project-container').get().forEach(project => {
        $project = $(project); 
        let shouldBeActive = projectShouldBeActive($project.data(), activeFilters); 
        if(shouldBeActive) {
            $project.addClass('active'); 
            $project.css('order', -1);
        } else {
            $project.removeClass('active'); 
            $project.css('order', 0);
        }
    })
}

/**
 * 
 */
function projectShouldBeActive(projectFilters, activeFilters) {
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
function unique(array) {
    return $.grep(array, function(el, index) {
        return index === $.inArray(el, array);
    });
}