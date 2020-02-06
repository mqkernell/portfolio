
$( document ).ready(function() {
    main();
});

function main() {
    $projectOverlay     = $('#project-detail');
    $detailCloseButton  = $('#detail-close-button');
    $detailImages       = $('#detail-images');
    $detailDescription  = $('#detail-description');

    $detailCloseButton.click(closeProjectOverlay); 

    addProjects(); 
    addButtons(); 
}

/**
 * 
 */
function addProjects() {
    let $projectSection = $('#projects')

    projects.forEach(project => {

        let $projectContainer = $('<div>', {
            class: "project-container " + project.name,
            // id: encodeURI(project.name), 
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
function addButtons() {
    // let $buttonSection = $('#buttons')
    let buttonCategories = {
        'medium': [],
        'tags': [],
        'date': [], 
    };

    buttonCategories.forEach(function(category) {
        
        projects.forEach(function(project) {
            // If the project has the section field defined (eg. project[date]), add that button
            if(project[category]) {
                
            }
        })
    })

    $buttonSection = $('<div>', {
        class: 'button-section ' + section, 
        id: section, 
    });

    $buttonSection.append($('<button>', {
        class: 'filter-button',
        id: ''
    }))
}

/**
 * 
 * @param {*} project 
 */
function addProjectOverlay(project) {
    console.log(project); 

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