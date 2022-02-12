class Graph {

    // Private attributes
    #current_id;
    #current_letter;
    #current_component_id;
    #levels;
    #current_graph;
    #sourceNode;
    #targetNode;

    constructor() {
        this.#current_id = 1;
        this.#current_letter = 'A';
        this.#current_component_id = 1;
        this.#levels = [0];
        this.#current_graph = this.#init_graph();
        this.#sourceNode = null;
        this.#targetNode = null;
        this.#set_events();
    }


    /*
    |--------------------------------------------------------------------------
    |                              Private Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Set up all events for graph
     */

    #set_events() {
        let self = this;
        this.#current_graph.on('click', function(event){
            self.#add_node(event);
        });

        // right mouse click
        this.#current_graph.on('cxttap', 'node', function(evt){
            if (!self.#sourceNode) {
                self.#sourceNode = this;
            } else {
                self.#targetNode = this;
                self.#add_edge();
            }
        });

        // double left mouse click on node
        this.#current_graph.on('dblclick', 'node', function () {
            if (this.hasClass('custom-select')) {
                this.removeClass('custom-select');
                if (this.data().component) {
                    this.style('background-color', '#D1F0E9');
                } else {
                    this.style('background-color', this.data().old_color);
                }
            } else {
                this.addClass('custom-select');
                this.style('background-color', 'grey');
            }
        });

        // double left mouse click on edge
        this.#current_graph.on('dblclick', 'edge', function () {
            if (this.hasClass('custom-select')) {
                this.removeClass('custom-select');
                console.log(this);
                this.style({
                    'line-color' : this.data().old_color,
                    'target-arrow-color': this.data().old_color,
                });
            } else {
                this.addClass('custom-select');
                this.style({
                    'line-color' : 'grey',
                    'target-arrow-color': 'grey',
                });
            }
        });

        this.#current_graph.on('click', 'node', function () {
            let label_input = $('#label');
            label_input.val(this.data('name'));
            label_input.attr('data-id', this.data('id'));
        })

    }

    // ========================================================================

    /**
     * Add new edge witch source and target nodes
     */

    #add_edge() {
        let edge_color = $('#color4').val();
        let edge = this.#current_graph.add([
            {
                group: "edges", data: { source: this.#sourceNode.data().id, target: this.#targetNode.data().id, weight: 10, old_color: edge_color}
            }
        ]);
        edge.style({'line-color' : edge_color,
            'target-arrow-color': edge_color});
        this.#sourceNode = null;
        this.#targetNode=  null;
    }

    // ========================================================================

    /**
     * Get all elements which have 'custom-select' class
     * @returns {*|jQuery.fn.init}
     */

    #get_all_selected_elements() {
        return this.#current_graph.$('.custom-select');
    }

    // ========================================================================

    /**
     * Add new node to the graph with never ending level generated name
     * @param event
     */

    #add_node(event) {
        let evtTarget = event.target;
        let node_color = $('#color3').val();

        if( evtTarget === this.#current_graph ){
            let xPos = event.position.x;
            let yPos = event.position.y;
            if (this.#current_id === 21) {
                if (this.#current_letter === 'Z') {
                    this.#current_letter = 'A';
                    this.#levels.push(this.#levels[this.#levels.length - 1] + 1);
                }else {
                    this.#current_letter = String.fromCharCode(this.#current_letter.charCodeAt(0) + 1);
                }
                this.#current_id = 1;
            }
            let newID = this.#current_letter + '_' + ((this.#levels[this.#levels.length - 1] === 0) ? '' : (this.#levels[this.#levels.length - 1] + '_')) + this.#current_id;
            let node = this.#current_graph.add([{
                group: "nodes",
                data: { id: newID, label: newID, name: newID, old_color: node_color},
                position: {
                    x: xPos,
                    y: yPos,
                },
            }]);
            this.#current_id++;

            node.style('background-color', node_color);
            // nodes_positions.set(newId, [xPos, yPos]);
        }
    }

    // ========================================================================

    /**
     * Create new component. Component is also a node but with extra attribute 'component' set to 'true'
     * @returns {*}
     */

    #add_component() {
        let newID = 'Komponenta_' + this.#current_component_id;
        let component = this.#current_graph.add([{
            group: "nodes",
            data: { id: newID, label: newID, name: newID, component: true},
        }]);
        this.#current_component_id++;
        return component;
    }

    // ========================================================================

    /**
     * From given elements remove class 'custom-select' and change their color
     * @param elements
     */

    #reset_selected_elements(elements) {
        elements.removeClass('custom-select');
        elements.map(ele => ele.style('background-color', ele.data().old_color))
    }

    // ========================================================================\

    /**
     *  Component is also a node but with extra attribute 'component' set to 'true'
     *  Get all nodes (components) which have component attribute set to true and have 0 children
     */

    #remove_empty_components() {
        this.#current_graph.nodes().filter(function (node) {
            return node.data('component') === true && node.children().length === 0;
        }).remove();
    }

    // ========================================================================

    /**
     * Init graph with some options and with example graph
     * @returns {*}
     */

    #init_graph() {
        let cy = cytoscape({
            container: document.getElementById('cy'),
            wheelSensitivity: 0.2,
            boxSelectionEnabled: false,
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
                    selector: ':parent',
                    css: {
                        'text-valign': 'top',
                        'text-halign': 'center',
                        'background-color' : '#D1F0E9'
                        ,
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
                    { data: { id: 'A' , name: 'A', old_color: '#a83030'} },
                    { data: { id: 'B' , name: 'B', old_color: '#a83030'} },
                    { data: { id: 'C' , name: 'C', old_color: '#a83030'} },
                    { data: { id: 'D' , name: 'D', old_color: '#a83030'} },
                    { data: { id: 'E' , name: 'E', old_color: '#a83030'} },
                    { data: { id: 'F' , name: 'F', old_color: '#a83030'} },
                    { data: { id: 'G' , name: 'G', old_color: '#a83030'} },
                    { data: { id: 'H' , name: 'H', old_color: '#a83030'} }
                ],
                edges: [
                    { data: { source: 'A', target: 'B' , weight: 5, old_color: '#83b55a'} },
                    { data: { source: 'B', target: 'C' , weight: 2, old_color: '#83b55a'} },
                    { data: { source: 'C', target: 'D' , weight: 1, old_color: '#83b55a'} },
                    { data: { source: 'D', target: 'E' , weight: 1, old_color: '#83b55a'} },
                    { data: { source: 'E', target: 'F' , weight: -20, old_color: '#83b55a'} },
                    { data: { source: 'F', target: 'G' , weight: -20, old_color: '#83b55a'} },
                    { data: { source: 'G', target: 'H' , weight: 50, old_color: '#83b55a'} },
                    { data: { source: 'D', target: 'D' , weight: 50, old_color: '#83b55a'} },
                    { data: { source: 'A', target: 'D' , weight: 50, old_color: '#83b55a'} },
                    { data: { source: 'A', target: 'E' , weight: -20, old_color: '#83b55a'} },
                    { data: { source: 'G', target: 'E' , weight: 20, old_color: '#83b55a'} }
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

    // ========================================================================

    /**
     * Get node by give ID
     * @param id
     * @returns {*}
     */

    get_specific_node(id) {
        return this.#current_graph.nodes('[id = "' + id + '"]');
    }

    // ========================================================================






    /*
    |--------------------------------------------------------------------------
    |                              End Private Methods
    |--------------------------------------------------------------------------
    */



    /*
    |--------------------------------------------------------------------------
    |                              Public Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Change text of element which was selected by a normal click (one click)
     */

    change_text() {
        let input = $('#label');
        let label_input = input.val();
        let regex = /\s+/g;
        let new_label = label_input.replaceAll(regex, ' ').trim();

        if (new_label.length === 0) return;

        let node = this.#current_graph.nodes('#' + input.attr('data-id'));
        node.data('name', new_label);
    }

    // ========================================================================

    /**
     * Make component with selected nodes
     */

    make_component() {
        let selected_nodes = this.#current_graph.nodes('.custom-select').filter(function (node) {
            return node.data('component') !== true;
        });

        if (selected_nodes.length === 0) return;

        let newComponent = this.#add_component();
        selected_nodes.move({parent: newComponent.data('id')});

        this.#reset_selected_elements(selected_nodes);
        this.#remove_empty_components();
    }

    // =================================================================================

    /**
     *  Change color of all selected (which contains class "custom-select") elements.
     */

    change_selected_elements_color() {
        let color = $('#color5').val();
        this.#get_all_selected_elements().nodes().style('background-color', color);
        this.#get_all_selected_elements().edges().style({
            'line-color' : color,
            'target-arrow-color': color,
        });
        this.#get_all_selected_elements().map(ele => ele.data('old_color', color))
        this.#get_all_selected_elements().removeClass('custom-select');
    }

    // ==================================================================================

    /**
     *  Removing all selected ( grey colored one )nodes
     */

    remove_selected_elements() {
        this.#get_all_selected_elements().remove();
        this.#sourceNode = null;
        this.#targetNode = null;
    }

    // ====================================================================================

    /**
     * Remove all custom classes, set default color to all edges and nodes as well.
     */

    reset_configuration() {
        this.#current_graph.elements().removeClass('custom-select');
        this.#current_graph.nodes().style('background-color', '#a83030');
        this.#current_graph.edges().style({
            'line-color' : '#83b55a',
            'target-arrow-color': '#83b55a',
        });
    }

    // ======================================================================================

    /**
     * Remove whole graph
     */

    clear_graph() {
        this.#current_graph.elements().remove();
        this.#current_letter = 'A';
        this.#levels = [0];
        this.#current_id = 1;
    }

    // =======================================================================================

    /**
     * Remove all edges from graph
     */

    clear_edges() {
        this.#current_graph.edges().remove();
    }

    // =======================================================================================







    /*
    |--------------------------------------------------------------------------
    |                              End Public Methods
    |--------------------------------------------------------------------------
    */
}