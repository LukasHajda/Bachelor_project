class Algorithm {

    #current_graph;
    #queue;
    #time;
    #animation_color;
    constructor(current_graph) {
        this.#current_graph = current_graph;
        this.#queue = $('.queue');
        this.#animation_color = system.animation_color;
    }

    call_algorithm(algo_name) {
        console.log(system.animation_color);
        console.log(algo_name);
        console.log(system.time_value);
        system.remove_log();
        this.#time = system.time_value * 1000;
        switch (algo_name) {
            case "BFS":
                this.#breadth_first_search();
                break;
            case "DFS":
                this.#depth_first_search();
                break;
            case "Kruskal":
                system.add_message(algo_name + ' algorithm starts', "start");
                this.#kruskal();
                break;
            case "Tarjan":
                system.add_message(algo_name + ' algorithm starts', "start");
                this.#tarjan();
                break;
            case "Prim":
                this.#prim();
                break;
            case "Topological":
                system.add_message(algo_name + ' algorithm starts', "start");
                this.#topological_sort();
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

    changeIncomesData(node) {
        node.data('name', node.data().original_name + ' Incomes: ' + node.data().incomes);
    }

    changeInfiniteLabel() {
        let nodes = graph.get_elements().nodes();

        $.each(nodes, function (index, node) {
            node.data('name', '');
            node.data('name', node.data().original_name + ' distance: ' + '∞');
        })
    }

    changeDistanceAndPredecessor(node, distance) {
        node.data('name', '');
        node.data('name', node.data().original_name + ' distance: ' + distance);
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

    checkForEmptyRoot() {
        console.log(system.node_select_value);
        if (system.node_select_value === "") {
            alert('Choose initial vertex');
            return true;
        }
        return false;
    }

    #breadth_first_search() {
        let edgesCollection = [];
        let nodesCollection = [];
        if (this.checkForEmptyRoot()) {
            return;
        }
        system.add_message('BFS algorithm starts', "start");

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
                system.add_message("BFS algorithm ends", "end");
                return;
            }

            self.makeExplored(current_obj.node);
            system.add_message("Explore  node: " + current_obj.node.data().original_name);
            real_queue.shift();
            self.#queue.text(real_queue);

            $.each(current_obj.edges, function (index, edge) {
                edge.animate({
                    style: {
                        'line-color': self.#animation_color,
                        'target-arrow-color': self.#animation_color
                    },
                }, {
                    duration: 500,
                    complete: function () {
                        if (current_obj.node.data().id === edge.source().data().id) {
                            if (!edge.target().hasClass('visited') && !edge.target().hasClass('explored')) {
                                self.makeVisited(edge.target());
                                system.add_message("Visit node: " + edge.target().data().original_name);
                                real_queue.push(edge.target().data().original_name);
                                self.#queue.text(real_queue);
                            }
                        }

                        if (current_obj.node.data().id === edge.target().data().id) {
                            if (!edge.source().hasClass('visited') && !edge.source().hasClass('explored')) {
                                self.makeVisited(edge.source());
                                system.add_message("Visit node: " + edge.source().data().original_name);
                                real_queue.push(edge.source().data().original_name);
                                self.#queue.text(real_queue);
                            }
                        }
                    }
                });
            })
            setTimeout(runBFSAnimation, self.#time);
        }

        runBFSAnimation();
    }

    #depth_first_search() {
        let edgesCollection = [];
        let nodesCollection = [];
        let map = new Map();
        if (this.checkForEmptyRoot()) {
            return;
        }
        system.add_message('DFS algorithm starts', "start");
        let root = system.node_select_value;
        graph.get_elements().dfs({
            roots: '#' + root,
            visit: function(v, e, u, i, depth){
                if (e !== undefined) {
                    edgesCollection.push(e);
                    console.log(e.source().data().id, e.target().data().id);
                }
                if (v !== undefined) {
                    nodesCollection.push(v.data().id);
                }
            },
            directed: system.get_direction
        });

        console.log(edgesCollection.map(edge => [edge.source().data().id, edge.target().data().id]));


        $.each(edgesCollection, function (index, edge) {
            let node1 = edge.source();
            let node2 = edge.target();
            if (index === 0) {
                if (root === node1.data().id) {
                    node1.data().succ.push([node2,edge]);
                    node2.data().pred = node1;
                } else {
                    node2.data().succ.push([node1,edge]);
                    node1.data().pred = node2;
                }


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

            if (current_node.data().pred === null && current_node.hasClass('visited') && current_node.data().succ.length === 0) {
                system.add_message("Explore node: " + current_node.data().original_name);
                self.makeExplored(current_node);
                system.add_message("DFS algorithm ends", "end");
                return;
            }

            self.makeVisited(current_node);

            let succ_edge = current_node.data().succ.shift()
            if (succ_edge === undefined) {
                system.add_message("Explore node: " + current_node.data().original_name);
                self.makeExplored(current_node);
                current_node = current_node.data().pred;
                setTimeout(runDFSAnimation, self.#time);
            } else {
                let edge = succ_edge[1];
                edge.animate({
                    style: {
                        'line-color' : self.#animation_color,
                        'target-arrow-color': self.#animation_color
                    }
                }, {
                    duration : 500,
                    complete : function() {
                        system.add_message("Visit node: " + succ_edge[0].data().original_name);
                        self.makeVisited(succ_edge[0]);
                    }
                });

                current_node = succ_edge[0];
                setTimeout(runDFSAnimation, self.#time)
            }
        }
        runDFSAnimation();
    }

    #bellman_ford() {
        if (this.checkForEmptyRoot()) {
            return;
        }
        system.add_message('Bellman-Ford algorithm starts', "start");
        let node_count = graph.get_elements().nodes().length;
        graph.get_elements().nodes().map(node => node.data().bf = Infinity);
        graph.get_elements().nodes().map(node => node.data().predecessor = null);
        let root = graph.get_specific_node(system.node_select_value);
        let edges = graph.get_elements().edges();

        this.changeInfiniteLabel();
        root.data().bf = 0;
        root.data().predecessor = root;

        root.data('name', root.data().original_name + ' distance: ' + root.data().bf);

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
                system.add_message("Bellman-Ford algorithm ends due to negative cycle", "end");
                negative_cycle = true;
            }
        });

        if (negative_cycle) return;


        let self = this;
        let current_obj = result.shift();
        let runBFAnimation = function () {
            graph.get_elements().nodes().map(node => node.removeClass('bf'));
            graph.get_elements().edges().map(edge => edge.style({
                'line-color' : $('#color4').val(),
                'target-arrow-color': $('#color4').val()
            }));

            if (current_obj === undefined) {
                system.add_message("Bellman-Ford algorithm ends", "end");
                return;
            }

            let target = current_obj.target;
            let edge = current_obj.edge;

            target.addClass('bf');
            system.add_message("Relaxing node " + target.data().original_name + "`s distance to " + current_obj.new_distance);
            edge.style(
                {'line-color' : self.#animation_color,
                'target-arrow-color': self.#animation_color});

            self.changeDistanceAndPredecessor(target, current_obj.new_distance, current_obj.source);
            current_obj = result.shift();
            setTimeout(runBFAnimation, self.#time);

        }

        runBFAnimation();
    }

    #kruskal() {
        graph.change_edges_directions(false);
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
                system.add_message("Kruskal algorithm ends", "end");
                return;
            }

            let current_edge = edge_arr[0];

            system.add_message("Pick smallest edge: [" + current_edge.source().data().original_name + ', ' + current_edge.target().data().original_name + ']');
            current_edge.animate({
                css: {
                    'line-color': self.#animation_color,
                    'target-arrow-color': self.#animation_color,
                    'transition-property':  'line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            }, {
                duration : 500,
            });
            setTimeout(runKruskalAnimation,self.#time);
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
        if (this.checkForEmptyRoot()) {
            return;
        }
        let count = 0;
        let count_nodes = graph.get_elements().nodes().length;
        graph.get_elements().bfs({
            roots: '#' + system.node_select_value,
            visit: function(v, e, u, i, depth){
                if (v !== undefined) {
                    count++;
                }
            },
            directed: false
        });

        if (count !== count_nodes) {
            alert('Graph has to be connected');
            return;
        }

        graph.change_edges_directions(false);
        system.add_message("Prim algorithm starts", "start");
        let root = system.node_select_value;
        let root_object = graph.get_specific_node(root);


        let nodes_collection = [];
        let node_graphs = graph.get_elements().nodes().length;
        let result = [];
        let self = this;
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
                system.add_message("Prim algorithm ends", "end");
                return
            }
            system.add_message("Pick smallest edge: [" + current_edge.source().data().original_name + ', ' + current_edge.target().data().original_name + '] with weight: ' + current_edge.data().weight);
            current_edge.animate({
                css: {
                    'line-color': self.#animation_color,
                    'target-arrow-color': self.#animation_color,
                    'transition-property':  'line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            }, {
                duration : 500,
            });
            setTimeout(runPrimAnimation, self.#time);

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
                system.add_message("Tarjan algorithm ends", "end");
                return;
            }
            current_edge = current_obj.edges.pop();

            if (current_edge === undefined) {
                self.makeLVK(current_obj.nodes, lkv);
                lkv++;
                current_obj = result_obj.pop();
                setTimeout(runTarjanAnimation, self.#time);
            } else {
                current_edge.animate({
                    css: {
                        'line-color': self.#animation_color,
                        'target-arrow-color': self.#animation_color,
                        'transition-property':  'line-color, target-arrow-color',
                        'transition-duration': '0.5s'
                    }
                }, {
                    duration : 500,
                });
                setTimeout(runTarjanAnimation,self.#time);
            }

        }

        runTarjanAnimation();
    }

    #topological_sort() {
        let nodes = graph.get_elements().nodes();
        let self = this;

        let result = [];
        let incomes = [];
        let queue = [];
        let anime = [];

        // Set incomes to all nodes
        $.each(nodes, function (index, node) {
           node.data().incomes = node.incomers().nodes().length;
           let income_original = node.data().incomes;
           incomes.push([node, income_original]);
           if (node.data().incomes === 0) {
               anime.push(node);
               queue.push(node);
               result.push(node);
           }
           self.changeIncomesData(node, '-');
        });


        let current_node;
        while(queue.length !== 0) {
            current_node = queue.shift();

            $.each(current_node.outgoers().nodes(), function (index, node) {
                node.data().incomes -= 1;
                anime.push(node);
                if (node.data().incomes === 0) {
                    queue.push(node);
                    result.push(node);
                }
            });
        }

        $.each(incomes, function (index, arr) {
            let node = arr[0];
            node.data().incomes = arr[1];
        });

        let count = 1;
        let r = [];

        system.add_message("Khan's algorithm starts", "start");
        let runKhanAnimation = function() {
            let current_node = anime.shift();
            if (current_node === undefined) {
                system.add_message("Khan's algorithm ends", "end");
                system.add_message("Final topological sort: " + result.map(node => node.data().original_name), "special");
                return;
            }

            console.log(current_node.data().id);

            if (current_node.data().incomes >= 0) {
                current_node.addClass('bf');
                if (current_node.data().incomes !== 0) {
                    current_node.data().incomes -= 1;
                    self.changeIncomesData(current_node);
                    system.add_message("Current node " + current_node.data().original_name + " has " +  current_node.data().incomes + " incomes nodes");
                    if (current_node.data().incomes === 0) {
                        r.push(current_node.data().original_name);
                        system.add_message("Node " + current_node.data().original_name + " is pushed into the queue");
                        system.add_message("Queue: " + r, "special");
                    }
                } else {
                    r.push(current_node.data().original_name);
                    system.add_message("Node " + current_node.data().original_name + " is pushed into the queue");
                    system.add_message("Queue: " + r, "special");
                }

                count++;

                setTimeout(runKhanAnimation, self.#time);

            }

        }
        runKhanAnimation();


    }

}