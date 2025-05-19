// js/graph-loader.js

// Keep track of loaded graphs to avoid re-initializing
const loadedGraphs = {};

function loadGraphForSection(sectionId) {
    if (loadedGraphs[sectionId]) {
        // console.log(`Graph for ${sectionId} already loaded.`);
        // Potentially make sure it's visible or re-layout if needed
        // loadedGraphs[sectionId].layout({ name: 'cose', animate: true }).run();
        return; // Already loaded
    }

    const graphContainerId = `${sectionId}-graph-container`;
    const infoPanelId = `${sectionId}-info-panel`;
    const graphDataPath = `data/${sectionId}_graph.json`; // Convention for JSON file names

    const graphContainer = document.getElementById(graphContainerId);
    const infoPanel = document.getElementById(infoPanelId);

    if (!graphContainer) {
        console.error(`Graph container not found for section: ${sectionId}`);
        return;
    }

    fetch(graphDataPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${graphDataPath}`);
            }
            return response.json();
        })
        .then(graphData => {
            const cy = cytoscape({
                container: graphContainer,
                elements: {
                    nodes: graphData.nodes,
                    edges: graphData.edges
                },
                style: [
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#888', // Default node color
                            'label': 'data(label)',
                            'width': 'mapData(weight, 30, 100, 20, 60)', // Example: use a 'weight' property if you have one
                            'height': 'mapData(weight, 30, 100, 20, 60)',
                            'font-size': '10px',
                            'text-valign': 'bottom',
                            'text-halign': 'center',
                            'text-margin-y': '5px',
                            'color': '#000', // Label color
                            'border-width': 1,
                            'border-color': '#555'
                        }
                    },
                    { // Specific style for certification nodes
                        selector: 'node[type="certification"]',
                        style: {
                            'background-color': '#007bff', // Blue for certs
                            'width': 60,
                            'height': 60,
                            'font-weight': 'bold',
                            'border-width': 2,
                            'border-color': '#0056b3',
                            // Example: 'background-image': 'data(logo)',
                            // 'background-fit': 'cover cover', // if using images
                        }
                    },
                    { // Specific style for topic nodes
                        selector: 'node[type="topic"]',
                        style: {
                            'background-color': '#28a745', // Green for topics
                            'width': 40,
                            'height': 40,
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 2,
                            'line-color': '#ccc',
                            'target-arrow-color': '#ccc',
                            'target-arrow-shape': 'triangle',
                            'curve-style': 'bezier', // 'haystack' is simpler, 'bezier' allows curves
                            'label': 'data(label)', // If edges have labels
                            'font-size': '8px',
                            'color': '#555',
                            'text-rotation': 'autorotate',
                            'text-margin-x': '5px',
                            'text-margin-y': '-5px',
                        }
                    },
                    { // Style for highlighted nodes and their neighbors
                        selector: '.highlighted',
                        style: {
                            'background-color': 'yellow',
                            'line-color': 'yellow',
                            'target-arrow-color': 'yellow',
                            'transition-property': 'background-color, line-color, target-arrow-color',
                            'transition-duration': '0.2s'
                        }
                    }
                ],
                layout: {
                    name: 'fcose', // fcose is good, or cose, cola
                    animate: true,
                    padding: 50,
                    idealEdgeLength: 120,
                    nodeRepulsion: 4500,
                    edgeElasticity: 0.45,
                    gravity: 0.25, // Attracts nodes to the center
                    // fcose specific options
                    quality: "default",
                    randomize: true,
                    fit: true,
                    // nodeSeparation: 75,
                }
            });

            // Store the graph instance
            loadedGraphs[sectionId] = cy;

            // Interactivity
            cy.on('mouseover', 'node', function(evt){
                const node = evt.target;
                node.addClass('highlighted');
                node.connectedEdges().addClass('highlighted'); // Highlight connected edges
                node.neighborhood().nodes().addClass('highlighted'); // Highlight neighbor nodes

                if (infoPanel) {
                    let details = `<strong>${node.data('label')}</strong> (${node.data('type') || 'N/A'})`;
                    if (node.data('details')) {
                        details += `<br>${node.data('details')}`;
                    }
                    if (node.data('date')) {
                        details += `<br><em>Date: ${node.data('date')}</em>`;
                    }
                    if (node.data('issuer')) {
                        details += `<br><em>Issuer: ${node.data('issuer')}</em>`;
                    }
                    infoPanel.innerHTML = details;
                }
            });

            cy.on('mouseout', 'node', function(evt){
                const node = evt.target;
                // Remove classes from all elements to reset state
                cy.elements().removeClass('highlighted');

                if (infoPanel) {
                    infoPanel.innerHTML = '<p>Hover over a node to see details.</p>';
                }
            });

            cy.on('tap', 'node', function(evt){
                const node = evt.target;
                if (node.data('url')) { // If you add a 'url' property to your node data
                    window.open(node.data('url'), '_blank');
                }
            });


            // Fit the graph to the container after layout
            cy.ready(() => {
                 cy.fit(undefined, 30); // Fit with 30px padding
            });
             // Handle window resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    cy.resize();
                    cy.fit(undefined, 30);
                }, 250);
            });


        })
        .catch(error => {
            console.error(`Error loading graph data for ${sectionId}:`, error);
            if (graphContainer) {
                graphContainer.innerHTML = `<p style="color:red;">Could not load graph data: ${error.message}</p>`;
            }
        });
}