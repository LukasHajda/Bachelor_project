class Algorithm {

    #current_graph
    #queue;
    constructor(current_graph) {
        this.#current_graph = current_graph;
        this.#queue = $('.queue');
    }

    call_algorithm(algo_name) {
        console.log(algo_name);
        switch (algo_name) {
            case "BFS":
                this.#breadth_first_search();
                break;
            case "DFS":
                this.#depth_first_search();
                break;
            case "Kruskal":
                this.#kruskal();
                break;
            case "Tarjan":
                this.#tarjan();
                break;
            case "Prim":
                this.#prim();
                break;
            case "Bellman-Ford":
                this.#bellman_ford();
                break;

        }

    }

    makeVisited(node) {
        node.addClass('visited');
        node.data('name', node.data().original_name + ' (visited)');
    }

    makeLVK(nodes, lkv) {
        $.each(nodes, function (index, node) {
            node.data('name', node.data().original_name + ' LKV: ' + lkv)
        })
    }

    changeInfiniteLabel() {
        let nodes = graph.get_elements().nodes();

        $.each(nodes, function (index, node) {
            node.data('name', '');
            node.data('name', node.data().original_name + ' distance: ' + '∞' + ' Pr: NULL');
        })
    }

    changeDistanceAndPredecessor(node, distance, source) {
        node.data('name', '');
        node.data('name', node.data().original_name + ' distance: ' + distance + ' Pr: ' + source.data().original_name);
    }

    makeComponents(nodes) {
        $.each(nodes, function (index, ele) {
            let nodes = ele.nodes();
            let component = graph.add_component();
            console.log(nodes);
            nodes.move({parent: component.data('id')});
        })
    }

    makeExplored(node) {
        node.removeClass('visited');
        node.addClass('explored');
        node.data('name', node.data().original_name + ' (explored)');
    }

    removeToggle(node) {
        node.removeClass('custom-border');
    }

    #breadth_first_search() {
        let edgesCollection = [];
        let nodesCollection = [];
        let is_directed = system.get_direction;
        graph.get_elements().bfs({
            roots: '#' + system.node_select_value,
            visit: function(v, e, u, i, depth){
                if (e !== undefined) {
                    edgesCollection.push(e);
                }

                if (v !== undefined) {
                    nodesCollection.push(v);
                }
            },
            directed: system.get_direction
        });

        console.log(nodesCollection);
        console.log(edgesCollection);

        let order = [];
        let self = this;

        while(nodesCollection.length !== 0) {
            let node = nodesCollection.shift();
            let edges = [];

            while (edgesCollection[0] !== undefined && (edgesCollection[0].source().data().id === node.data().id || edgesCollection[0].target().data().id === node.data().id)) {
                let e = edgesCollection.shift()
                edges.push(e);
            }
            let obj = {
                node: node,
                edges: edges
            };

            order.push(obj);
        }

        let real_queue = [];

        let runBFSAnimation = function () {
            let current_obj = order.shift();

            if (current_obj === undefined) {
                return;
            }

            self.makeExplored(current_obj.node);
            real_queue.shift();
            self.#queue.text(real_queue);

            $.each(current_obj.edges, function (index, edge) {
                edge.animate({
                    style: {
                        'line-color': 'yellow',
                        'target-arrow-color': 'yellow'
                    },
                }, {
                    duration: 500,
                    complete: function () {
                        if (current_obj.node.data().id === edge.source().data().id) {
                            if (!edge.target().hasClass('visited') && !edge.target().hasClass('explored')) {
                                self.makeVisited(edge.target());
                                real_queue.push(edge.target().data().original_name);
                                self.#queue.text(real_queue);
                            }
                        }

                        if (current_obj.node.data().id === edge.target().data().id) {
                            if (!edge.source().hasClass('visited') && !edge.source().hasClass('explored')) {
                                self.makeVisited(edge.source());
                                real_queue.push(edge.source().data().original_name);
                                self.#queue.text(real_queue);
                            }
                        }
                    }
                });
            })
            setTimeout(runBFSAnimation, 2000);
        }

        runBFSAnimation();
    }

    #depth_first_search() {
        let edgesCollection = [];
        let nodesCollection = [];
        let map = new Map();
        let is_directed = system.get_direction;
        let root = system.node_select_value;
        graph.get_elements().dfs({
            roots: '#' + root,
            visit: function(v, e, u, i, depth){
                if (e !== undefined) {
                    edgesCollection.push(e);
                }
                if (v !== undefined) {
                    nodesCollection.push(v.data().id);
                }
            },
            directed: system.get_direction
        });


        $.each(edgesCollection, function (index, edge) {
            let node1 = edge.source();
            let node2 = edge.target();
            if (index === 0) {
                node1.data().succ.push([node2,edge]);
                node2.data().pred = node1;

                map.set(node1.data().id, node1);
                map.set(node2.data().id, node2);
            } else {
                if (!map.has(node1.data().id)) {
                    node2.data().succ.push([node1, edge]);
                    node1.data().pred = node2;
                    map.set(node1.data().id, node1);
                }

                if (!map.has(node2.data().id)) {
                    node1.data().succ.push([node2, edge]);
                    node2.data().pred = node1;
                    map.set(node2.data().id, node2);
                }
            }
        });

        let current_node = map.get(root);
        let self = this;
        
        let runDFSAnimation = function() {

            if (current_node.data().pred === null && current_node.hasClass('visited')) {
                self.makeExplored(current_node);
                return;
            }

            self.makeVisited(current_node);

            let succ_edge = current_node.data().succ.shift()
            if (succ_edge === undefined) {
                self.makeExplored(current_node);
                current_node = current_node.data().pred;
                setTimeout(runDFSAnimation, 3000);
            } else {
                let edge = succ_edge[1];
                edge.animate({
                    style: {
                        'line-color' : 'yellow',
                        'target-arrow-color': 'yellow'
                    }
                }, {
                    duration : 500,
                    complete : function() {
                        self.makeVisited(succ_edge[0]);
                    }
                });

                current_node = succ_edge[0];
                setTimeout(runDFSAnimation, 3000)
            }
        }
        runDFSAnimation();
    }

    #bellman_ford() {
        let node_count = graph.get_elements().nodes().length;
        graph.get_elements().nodes().map(node => node.data().bf = Infinity);
        graph.get_elements().nodes().map(node => node.data().predecessor = null);
        let root = graph.get_specific_node(system.node_select_value);
        let edges = graph.get_elements().edges();

        this.changeInfiniteLabel();
        root.data().bf = 0;
        root.data().predecessor = root;

        root.data('name', root.data().original_name + ' distance: ' + root.data().bf + ' Pr: ' + root.data().predecessor.data().original_name);

        let count = 1;

        let result = [];

        for( ;; ) {
            if (count === node_count) {
                break;
            }

            $.each(edges, function (index, edge) {
                console.log(edge.source().data().id, edge.target().data().id);
                if (edge.source().data().bf + edge.data().weight < edge.target().data().bf) {
                    result.push({
                        edge: edge,
                        source: edge.source(),
                        target: edge.target(),
                        new_distance: edge.source().data().bf + edge.data().weight
                    })
                    edge.target().data().bf = edge.source().data().bf + edge.data().weight;
                    edge.target().data().predecessor = edge.source();
                }
            });

            count++;
        }

        // Check negative cycle
        let negative_cycle = false;
        $.each(edges, function (index, edge) {
            if (edge.source().data().bf + edge.data().weight < edge.target().data().bf) {
                alert('Graf obsahuje negatívny cyklus');
                negative_cycle = true;
            }
        });

        if (negative_cycle) return;


        let self = this;
        let current_obj = result.shift();
        let runBFAnimation = function () {
            graph.get_elements().nodes().map(node => node.removeClass('bf'));
            graph.get_elements().edges().map(edge => edge.style({
                'line-color' : '#83b55a',
                'target-arrow-color': '#83b55a'
            }));

            if (current_obj === undefined) {
                return;
            }

            let target = current_obj.target;
            let edge = current_obj.edge;

            target.addClass('bf');
            edge.style(
                {'line-color' : 'blue',
                'target-arrow-color': 'blue'});

            self.changeDistanceAndPredecessor(target, current_obj.new_distance, current_obj.source);
            current_obj = result.shift();
            setTimeout(runBFAnimation, 3000);

        }

        runBFAnimation();
    }

    #kruskal() {
        let nodes = graph.get_elements().nodes();
        let test = graph.get_elements().edges().sort(function (edge1, edge2) {
            return edge1.data().weight - edge2.data().weight;
        })

        $.each(test, function (index, edge) {
            nodes.push(edge);
        })

        let sorted_edges = nodes.kruskal().edges().map(edge => [edge, edge.data().weight]);

        let self = this;
        let runKruskalAnimation  = function() {

            let edge_arr = sorted_edges.shift();

            if (edge_arr === undefined) {
                return;
            }

            let current_edge = edge_arr[0];

            current_edge.animate({
                css: {
                    'line-color': '#61bffc',
                    'target-arrow-color': '#61bffc',
                    'transition-property':  'line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            }, {
                duration : 500,
            });
            setTimeout(runKruskalAnimation,2000);
        }

        runKruskalAnimation();

    }

    #expand_collection(nodes) {
        let new_collection = graph.make_collection();

        $.each(nodes, function (index, node) {
            let node_object = graph.get_specific_node(node);
            new_collection.merge(node_object.outgoers().edges()).merge(node_object.incomers().edges());
        })

        return new_collection;
    }


    #prim() {
        graph.change_edges_directions(false);
        let root = system.node_select_value;
        let root_object = graph.get_specific_node(root);


        let nodes_collection = [];
        let node_graphs = graph.get_elements().nodes().length;
        let result = [];

        nodes_collection.push(root);

        root_object.data().finished = 1;

        while(nodes_collection.length !== node_graphs) {
            let coll = this.#expand_collection(nodes_collection);

            let minEdge = coll.min(function(edge){
                return edge.data().weight;
            }).ele;

            while(minEdge.source().data().finished === 1 && minEdge.target().data().finished === 1) {
                coll.unmerge(minEdge);
                minEdge = coll.min(function(edge){
                    return edge.data().weight;
                }).ele;
            }
            result.push(minEdge);
            if (minEdge.source().data().finished === -1) {
                minEdge.source().data().finished = 1;
                nodes_collection.push(minEdge.source().data().id);
            }

            if (minEdge.target().data().finished === -1) {
                minEdge.target().data().finished = 1;
                nodes_collection.push(minEdge.target().data().id);
            }
        }

        let runPrimAnimation = function () {
            let current_edge = result.shift();
            if (current_edge === undefined) {
                return
            }
            current_edge.animate({
                css: {
                    'line-color': '#61bffc',
                    'target-arrow-color': '#61bffc',
                    'transition-property':  'line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            }, {
                duration : 500,
            });
            setTimeout(runPrimAnimation,2000);

        }
        runPrimAnimation();

    }

    #tarjan() {
        let self = this;
        let tsc = graph.get_elements().tarjanStronglyConnected();
        let result_obj = [];
        // let component_count = 1;

        $.each(tsc.components, function (index, coll) {
            result_obj.push({
               index: index + 1,
               nodes: coll.nodes(),
               edges: coll.edges(),
            });
        });


        result_obj = result_obj.reverse();
        
        let current_obj = result_obj.pop();
        let current_edge = null;
        let lkv = 1;

        let runTarjanAnimation = function () {
            
            if (current_obj === undefined) {
                self.makeComponents(tsc.components);
                return;
            }
            current_edge = current_obj.edges.pop();

            if (current_edge === undefined) {
                self.makeLVK(current_obj.nodes, lkv);
                lkv++;
                current_obj = result_obj.pop();
                setTimeout(runTarjanAnimation, 1500);
            } else {
                current_edge.animate({
                    css: {
                        'line-color': '#61bffc',
                        'target-arrow-color': '#61bffc',
                        'transition-property':  'line-color, target-arrow-color',
                        'transition-duration': '0.5s'
                    }
                }, {
                    duration : 500,
                });
                setTimeout(runTarjanAnimation,1500);
            }

        }

        runTarjanAnimation();
    }


    #transposed_graph() {
        graph.make_transposed();
    }

    #topological_sort() {

    }

}