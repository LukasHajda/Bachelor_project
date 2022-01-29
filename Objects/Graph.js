// export function Graph(cy) {
//
//     this.current_graph = cy;
//     this.nodes = cy.nodes();
//     this.edges = cy.edges();
//
// }

// Graph.prototype.current_graph = cy;
// Graph.prototype.nodes = cy.nodes();
// Graph.prototype.edges = cy.edges();

class Graph {
    constructor() {
        this.current_id = 1;
        this.current_letter = 'A';
        this.levels = [0];
        this.current_graph = this.init_graph();
        this.nodes = this.current_graph.nodes();
        this.edges = this.current_graph.edges();
        this.sourceNode = null;
        this.targetNode = null;
        this.setEvents();
    }


    remove_nodes() {
        this.get_all_selected_nodes().remove();
        console.log(this.current_graph.edges().length);
    }

    get_all_selected_nodes() {
        return this.current_graph.$('.custom-select');
    }

    get_specific_node(id) {
        return this.current_graph.nodes('[id = "' + id + '"]');
    }

    add_edge() {
        this.current_graph.add([
            {
                group: "edges", data: { source: this.sourceNode.data().id, target: this.targetNode.data().id, weight: 10}
            }
        ]);
        this.sourceNode = null;
        this.targetNode=  null;
    }

    change_nodes_color(nodes = '*', color) {
        if (nodes === '*') {
            this.nodes.style('background-color', color);
        } else {
            nodes.style('background-color', color);
        }
    }

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

    setEvents() {
        let self = this;
        this.current_graph.on('tap', function(event){
           self.add_node(event);
        });

        this.current_graph.on('cxttap', 'node', function(evt){
            if (!self.sourceNode) {
                self.sourceNode = this;
            } else {
                self.targetNode = this;
                self.add_edge();
            }

            console.log(self.get_all_selected_nodes());
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
        
    }

    clear_edges() {
        this.edges.remove();
    }

    clear_graph() {
        this.current_graph.elements().remove();
    }

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