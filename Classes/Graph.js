class Graph {

    // Private attributes
    #current_id;
    #current_letter;
    #current_component_id;
    #levels;
    #current_graph;
    #sourceNode;
    #targetNode;
    #directed;

    constructor() {
        this.#current_id = 1;
        this.#current_letter = 'A';
        this.#current_component_id = 1;
        this.#levels = [0];
        this.#current_graph = this.#init_graph();
        this.#sourceNode = null;
        this.#targetNode = null;
        this.#set_events();
        this.#set_direction();
    }

    /*
    |--------------------------------------------------------------------------
    |                              Private Methods
    |--------------------------------------------------------------------------
    */


    #set_direction() {
        this.#current_graph.edges().map(edge => edge.addClass('directed'));
    }


    /**
     * Set up all events for graph
     */

    #set_events() {
        let self = this;
        this.#current_graph.on('click', function(event){
            self.#add_node(event);
        });

        // delete selected elements with DEL key
        window.addEventListener('keydown', function (event) {
            if (event.key === 'Delete') {
                self.remove_selected_elements();
            }
        })

        // right mouse click
        this.#current_graph.on('cxttap', 'node', function(){
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
            system.add_node_option({id : this.data().id, name: this.data().name});
        })

        this.#current_graph.on('click', 'edge', function () {
            let label_input = $('#label_edge');
            label_input.val(this.data('weight'));
            label_input.attr('data-id', this.data('id'));
        })

    }

    // ========================================================================

    #select_elements(arr, group) {
        $.each(arr, function (index, value) {

            if (group === 'edges') {
                value.style({
                    'line-color' : 'grey',
                    'target-arrow-color': 'grey',
                });
            } else {
                value.style('background-color', 'grey');
            }
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
        edge.addClass(system.get_direction ? 'directed' : 'undirected');
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
                data: { id: newID, label: newID, name: newID, old_color: node_color, original_name: newID, discovered: -1, finished: -1, incomes: 0, visited: false, pred: null, predecessor: null, bf: Infinity, tarjan: false, succ: []},
                position: {
                    x: xPos,
                    y: yPos,
                },
            }]);
            this.#current_id++;

            node.style('background-color', node_color);

            system.add_node_option({id: node.data().id, name: node.data().name});
            // nodes_positions.set(newId, [xPos, yPos]);
        }
    }

    // ========================================================================

    /**
     * Create new component. Component is also a node but with extra attribute 'component' set to 'true'
     * @returns {*}
     */

    add_component() {
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
            autounselectify: true,
            // zoomingEnabled: false,

            style : [
                {
                    selector : 'nodes',
                    style : {
                        'content': 'data(name)',
                        'font-size' : 29,
                        'background-color' : '#a83030',
                        'width' : 40,
                        'height' : 40,
                    }
                },
                {
                    selector: '.custom-select',
                    style: {
                        'background-color' : 'yellow',
                    }
                },
                {
                    selector : '.visited',
                    style : {
                        'border-color': 'grey',
                        'border-width': 8,
                    }
                },
                {
                    selector: '.bf_hide',
                    style: {
                        'opacity': 0,
                    }
                },
                {
                    selector : '.explored',
                    style : {
                        'border-color': 'black',
                        'border-width': 8,
                    }
                },
                {
                    selector: '.bf',
                    style: {
                        'border-color': 'blue',
                        'border-width': 8,
                    }
                },
                {
                    selector: '.bf_edge',
                    style: {
                        'line-color' : 'yellow',
                        'target-arrow-color': 'yellow'
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
                    selector: '.directed',
                    css: {
                        'target-arrow-shape' : 'triangle',
                    }
                },
                {
                    selector: '.undirected',
                    css: {
                        'target-arrow-shape' : 'none',
                    }
                },
                {
                    selector: 'edges',
                    style: {
                        'curve-style' : 'bezier',
                        'font-size' : 27,
                        'line-color' : '#83b55a',
                        'target-arrow-color': '#83b55a',
                        'width': 6,
                        'arrow-scale': 1.8,
                        'label': 'data(weight)',
                        'text-margin-y': 15,
                        'text-rotation': 'autorotate'
                    }
                },
            ],

            elements: {
                nodes: [
                    { data: { id: 'A' , name: 'A', old_color: '#a83030', succ: [], pred: null, incomes: 0, original_name: 'A', visited : false, discovered : -1, finished : -1, predecessor: null, bf: Infinity, tarjan: false} },
                    { data: { id: 'B' , name: 'B', old_color: '#a83030', succ: [], pred: null, incomes: 0, original_name: 'B', visited : false, discovered : -1, finished : -1, predecessor: null, bf: Infinity, tarjan: false} },
                    { data: { id: 'C' , name: 'C', old_color: '#a83030', succ: [], pred: null, incomes: 0, original_name: 'C', visited : false, discovered : -1, finished : -1, predecessor: null, bf: Infinity, tarjan: false} },
                    { data: { id: 'D' , name: 'D', old_color: '#a83030', succ: [], pred: null, incomes: 0, original_name: 'D', visited : false, discovered : -1, finished : -1, predecessor: null, bf: Infinity, tarjan: false} },
                    { data: { id: 'E' , name: 'E', old_color: '#a83030', succ: [], pred: null, incomes: 0, original_name: 'E', visited : false, discovered : -1, finished : -1, predecessor: null, bf: Infinity, tarjan: false} },
                    { data: { id: 'F' , name: 'F', old_color: '#a83030', succ: [], pred: null, incomes: 0, original_name: 'F', visited : false, discovered : -1, finished : -1, predecessor: null, bf: Infinity, tarjan: false} },
                    { data: { id: 'H' , name: 'H', old_color: '#a83030', succ: [], pred: null, incomes: 0, original_name: 'H', visited : false, discovered : -1, finished : -1, predecessor: null, bf: Infinity, tarjan: false} },
                    { data: { id: 'I' , name: 'I', old_color: '#a83030', succ: [], pred: null, incomes: 0, original_name: 'I', visited : false, discovered : -1, finished : -1, predecessor: null, bf: Infinity, tarjan: false} },
                    { data: { id: 'J' , name: 'J', old_color: '#a83030', succ: [], pred: null, incomes: 0, original_name: 'J', visited : false, discovered : -1, finished : -1, predecessor: null, bf: Infinity, tarjan: false} },
                ],
                edges: [
                    { data: { source: 'B', target: 'A' , weight: 20, old_color: '#83b55a',tarjan: false} },
                    { data: { source: 'B', target: 'D' , weight: 10, old_color: '#83b55a',tarjan: false} },
                    { data: { source: 'D', target: 'A' , weight: 10, old_color: '#83b55a',tarjan: false} },


                    { data: { source: 'A', target: 'J' , weight: 5, old_color: '#83b55a',tarjan: false} },


                    { data: { source: 'C', target: 'F' , weight: 5, old_color: '#83b55a',tarjan: false} },
                    { data: { source: 'F', target: 'E' , weight: 4, old_color: '#83b55a',tarjan: false} },
                    { data: { source: 'E', target: 'C' , weight: 10, old_color: '#83b55a',tarjan: false} },


                    { data: { source: 'J', target: 'I' , weight: 78, old_color: '#83b55a',tarjan: false} },
                    { data: { source: 'J', target: 'H' , weight: 1, old_color: '#83b55a',tarjan: false} },
                    { data: { source: 'H', target: 'F' , weight: 5, old_color: '#83b55a',tarjan: false} },


                ]
            },

            animate: true, // whether to animate changes to the layout
            animationDuration: 500, // duration of animation in ms, if enabled
            animationEasing: undefined, // easing of animation, if enabled
            animateFilter: function (){ return true; },

            layout: {
                name: 'grid',
                padding: 10,
                directed: true,
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
        node.data('original_name', new_label);
        node.data('name', new_label);
    }

    // ========================================================================

    /**
     * Change weight of edge which was selected by a normal click (one click)
     */

    change_text_edge() {
        let input = $('#label_edge');
        let label_input = input.val();
        let regex = /^-?([1-9][0-9]*)$/g;
        let pass = regex.test(label_input);
        let edge = this.#current_graph.edges('#' + input.attr('data-id'));
        if (pass) {
            edge.data('weight', parseInt(label_input));
        } else {
            alert('Musi byt validne cele cislo');
        }
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

        let newComponent = this.add_component();
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
        this.#current_graph.elements().removeClass('visited');
        this.#current_graph.elements().removeClass('explored');
        this.#current_graph.nodes().map(node => node.data('name', node.data().original_name));
        this.#current_graph.nodes().map(node => node.data().discovered = -1);
        this.#current_graph.nodes().map(node => node.data().finished = -1);
        this.#current_graph.nodes().map(node => node.data().reversed = 0);
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

    select_all_edges() {
        let edges = this.#current_graph.edges()
        edges.removeClass('custom-select');
        edges.addClass('custom-select');
        this.#select_elements(edges, 'edges');
    }

    // =======================================================================================

    select_all_nodes() {
        let nodes = this.#current_graph.nodes();
        nodes.removeClass('custom-select');
        nodes.addClass('custom-select');
        this.#select_elements(nodes, 'nodes');
    }

    // =======================================================================================

    get_elements() {
        return this.#current_graph.elements();
    }

    get_nodes() {
        return this.#current_graph.nodes();
    }

    show_time() {
        let n = graph.get_nodes().map(node => [node.data().name, node.data().discovered, node.data().finished]);
        console.log(n);
    }

    change_time(id, discovered, time) {
        if (discovered) {
            this.#current_graph.nodes('[id = "' + id + '"]').data().discovered = time;
        } else {
            this.#current_graph.nodes('[id = "' + id + '"]').data().finished = time;
        }
    }

    // =======================================================================================

    run_algorithm(algo_name) {
        let algorithm = new Algorithm(this.#current_graph);
        algorithm.call_algorithm(algo_name);

    }

    // =======================================================================================

    change_edges_directions(direction_option) {
        if (direction_option) {
            this.#current_graph.edges().map(edge => edge.removeClass('undirected').addClass('directed'));
        } else {
            this.#current_graph.edges().map(edge => edge.removeClass('directed').addClass('undirected'));
        }
    }


    make_transposed() {
        let old_edges = this.#current_graph.edges().map(edge => [edge.source().data().id, edge.target().data().id, edge.data().weight]);

        this.clear_edges();


        let self = this;
        let color = $('#color4').val();
        $.each(old_edges, function (index, edge) {
            let new_edge = self.#current_graph.add([
                {
                    group: "edges", data: { source: edge[1], target: edge[0], weight: edge[2], old_color: color}
                }
            ]);
            new_edge.style({'line-color' : color,
                'target-arrow-color': color});
        new_edge.addClass(system.get_direction ? 'directed' : 'undirected');
        })

    }


    sorted_by_finished() {
        return this.#current_graph.nodes().sort(function (node1, node2) {
            return node1.data().finished - node2.data().finished;
        }).toArray();
    }

    get_undiscovered_nodes() {
        return this.#current_graph.nodes().filter(function (node) {
            return node.data().discovered === -1;
        }).map(node => node.data().id);
    }

    make_collection() {
        return this.#current_graph.collection();
    }

    get_tarjaned_edges() {
        return this.#current_graph.edges().filter(function (edge) {
            return edge.data().tarjan === false;
        }).length;
    }

    change_edge_weight(edge, weight) {
        edge.data('weight', parseInt(weight));
    }

    get_current_graph() {
        return this.#current_graph;
    }




    /*
    |--------------------------------------------------------------------------
    |                              End Public Methods
    |--------------------------------------------------------------------------
    */
}