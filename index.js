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

$().ready(function() {
    $projectOverlay     = $('#project-detail');
    $detailCloseButton  = $('#detail-close-button');
    $detailImages       = $('#detail-images');
    $detailDescription  = $('#detail-description');

    $detailCloseButton.click(closeProjectOverlay); 
    
    addFilterButtons(buttonCategories); 
    addProjects(); 
});


/**
 * 
 */
function addProjects() {
    let $projectSection = $('#projects');
    
    projects.forEach(function(project) {
        let $projectContainer = $('<div>', {
            class: "project-container active",
            data: getProjectTags(project)
        });
        
        $projectContainer.click(function() {
            addProjectOverlay(project); 
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
 */
function onCategoryButtonClick(category, value) {

}

/** 
 * 
 */
function filterImages() {
    
}

/**
 * 
 * @param {*} project 
 */
function addProjectOverlay(project) {
    // console.log(project); 

    // Clear images and description
    $detailImages.empty(); 
    $detailDescription.empty(); 

    // Show overlay
    $projectOverlay.addClass('active'); 

    // Add images
    project.images.forEach(img => {
        $detailImages.append($('<img />', { 
            class: "detail-image", 
            src: './assets/' + project.image_base + "/" + img.src,
            alt: img.alt || '', 
        })); 
    })

    // Add project description
    $detailDescription.text(project.description);
}


/**
 * 
 */
function closeProjectOverlay() {
    $projectOverlay.removeClass('active'); 
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
        console.log(shouldBeActive);
        if(shouldBeActive) {
            $project.addClass('active'); 
        } else {
            $project.removeClass('active'); 
        }
    })
}

/**
 * 
 */
function projectShouldBeActive(projectFilters, activeFilters) {
    // console.log(projectFilters);
    // console.log(activeFilters);
    let active = true; 
    for(let cat in activeFilters) {
        activeFilters[cat].forEach(function(val) {
            console.log(val, projectFilters[cat], $.inArray(val, projectFilters[cat]));

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
function clearFilters() {
    this.activeFilters = {};
}

