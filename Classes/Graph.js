class Graph {
    constructor() {
        this.current_id = 1;
        this.current_letter = 'A';
        this.levels = [0];
        this.current_graph = this.init_graph();
        this.sourceNode = null;
        this.targetNode = null;
        this.setEvents();
    }

    /**
     *  Removing all selected ( grey colored one )nodes
     */

    remove_selected_elements() {
        this.get_all_selected_elements().remove();
        this.sourceNode = null;
        this.targetNode = null;
    }

    /**
     * Get all elements which have 'custom-select' class
     * @returns {*|jQuery.fn.init}
     */

    get_all_selected_elements() {
        return this.current_graph.$('.custom-select');
    }

    /**
     * Get node by give ID
     * @param id
     * @returns {*}
     */

    get_specific_node(id) {
        return this.current_graph.nodes('[id = "' + id + '"]');
    }

    /**
     * Add new edge witch source and target nodes
     */

    add_edge() {
        this.current_graph.add([
            {
                group: "edges", data: { source: this.sourceNode.data().id, target: this.targetNode.data().id, weight: 10}
            }
        ]);
        this.sourceNode = null;
        this.targetNode=  null;
    }

    change_selected_elements_color() {
        let color = $('#color5').val();
        this.get_all_selected_elements().nodes().style('background-color', color);
        this.get_all_selected_elements().edges().style({
            'line-color' : color,
            'target-arrow-color': color,
        });
        this.get_all_selected_elements().removeClass('custom-select');
    }

    /**
     * Add new node to the graph with never ending level generated name
     * @param event
     */

    add_node(event) {
        let evtTarget = event.target;

        if( evtTarget === this.current_graph ){
            let xPos = event.position.x;
            let yPos = event.position.y;
            if (this.current_id === 21) {
                if (this.current_letter === 'Z') {
                    this.current_letter = 'A';
                    this.levels.push(this.levels[this.levels.length - 1] + 1);
                }else {
                    this.current_letter = String.fromCharCode(this.current_letter.charCodeAt(0) + 1);
                }
                this.current_id = 1;
            }
            let newID = this.current_letter + '_' + ((this.levels[this.levels.length - 1] === 0) ? '' : (this.levels[this.levels.length - 1] + '_')) + this.current_id;
            console.log(newID);
            console.log(xPos, yPos);
            let node = this.current_graph.add([{
                group: "nodes",
                data: { id: newID, label: newID, name: newID},
                position: {
                    x: xPos,
                    y: yPos,
                },
            }]);
            this.current_id++;

            node.style('background-color', $('#color3').val());
            console.log(this.current_graph.nodes().length);
            // nodes_positions.set(newId, [xPos, yPos]);
        }
    }

    /**
     * Set up all events for graph
     */

    setEvents() {
        let self = this;
        this.current_graph.on('click', function(event){
           self.add_node(event);
        });

        this.current_graph.on('cxttap', 'node', function(evt){
            if (!self.sourceNode) {
                self.sourceNode = this;
            } else {
                self.targetNode = this;
                self.add_edge();
            }

            console.log(self.get_all_selected_elements());
        });

        this.current_graph.on('dblclick', 'node', function () {
            if (this.hasClass('custom-select')) {
                this.removeClass('custom-select');
                this.style('background-color', $('#color3').val());
            } else {
                this.addClass('custom-select');
                this.style('background-color', 'grey');
            }
        });

        this.current_graph.on('dblclick', 'edge', function () {
            if (this.hasClass('custom-select')) {
                this.removeClass('custom-select');
                this.style({
                    'line-color' : '#83b55a',
                    'target-arrow-color': '#83b55a',
                });
            } else {
                this.addClass('custom-select');
                this.style({
                    'line-color' : 'grey',
                    'target-arrow-color': 'grey',
                });
            }
        });
        
    }

    /**
     * Remove all edges from graph
     */

    clear_edges() {
        this.current_graph.edges().remove();
    }

    /**
     * Remove whole graph
     */

    clear_graph() {
        this.current_graph.elements().remove();
    }

    /**
     * Init graph with some options and with example graph
     * @returns {*}
     */

    init_graph() {
        let cy = cytoscape({
            container: document.getElementById('cy'),
            wheelSensitivity: 0.2,
            // zoomingEnabled: false,

            style : [
                {
                    selector : 'nodes',
                    style : {
                        'content': 'data(name)',
                        'background-color' : '#a83030',
                        'width' : 40,
                        'height' : 40
                    }
                },
                {
                    selector: '.custom-select',
                    style: {
                        'background-color' : 'yellow',
                    }
                },
                {
                    selector: 'edges',
                    style: {
                        'curve-style' : 'bezier',
                        'target-arrow-shape' : 'triangle',
                        'line-color' : '#83b55a',
                        'target-arrow-color': '#83b55a',
                        'width': 8,
                        'label': 'data(weight)',
                        'text-margin-y': 15,
                        'text-rotation': 'autorotate'
                    }
                },
            ],

            elements: {
                nodes: [
                    { data: { id: 'A' , name: 'A'} },
                    { data: { id: 'B' , name: 'B'} },
                    { data: { id: 'C' , name: 'C'} },
                    { data: { id: 'D' , name: 'D'} },
                    { data: { id: 'E' , name: 'E'} },
                    { data: { id: 'F' , name: 'F'} },
                    { data: { id: 'G' , name: 'G'} },
                    { data: { id: 'H' , name: 'H'} }
                ],
                edges: [
                    { data: { source: 'A', target: 'B' , weight: 5} },
                    { data: { source: 'B', target: 'C' , weight: 2} },
                    { data: { source: 'C', target: 'D' , weight: 1} },
                    { data: { source: 'D', target: 'E' , weight: 1} },
                    { data: { source: 'E', target: 'F' , weight: -20} },
                    { data: { source: 'F', target: 'G' , weight: -20} },
                    { data: { source: 'G', target: 'H' , weight: 50} },
                    { data: { source: 'D', target: 'D' , weight: 50} },
                    { data: { source: 'A', target: 'D' , weight: 50} },
                    { data: { source: 'A', target: 'E' , weight: -20} },
                    { data: { source: 'G', target: 'E' , weight: 20} }
                ]
            },

            animate: true, // whether to animate changes to the layout
            animationDuration: 500, // duration of animation in ms, if enabled
            animationEasing: undefined, // easing of animation, if enabled
            animateFilter: function (){ return true; },

            layout: {
                name: 'grid',
                directed: true,
                padding: 10,
                motionBlur: true,
                autolock: true
            }
        }); // cy init;

        cy.fit()
        return cy;
    }
}