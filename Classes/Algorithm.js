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

    /**
     * Call specific algorithm
     * @param algo_name
     */

    call_algorithm(algo_name) {
        system.remove_log();
        this.#time = system.time_value * 1000;
        switch (algo_name) {
            case "BFS":
                graph.reset_configuration();
                this.#breadth_first_search();
                break;
            case "DFS":
                graph.reset_configuration();
                this.#depth_first_search();
                break;
            case "Kruskal":
                graph.reset_configuration();
                system.add_message(algo_name + ' algoritmus sa spustil', "start");
                this.#kruskal();
                break;
            case "Tarjan":
                graph.reset_configuration();
                system.add_message(algo_name + ' algoritmus sa spustil', "start");
                this.#tarjan();
                break;
            case "Prim":
                graph.reset_configuration();
                this.#prim();
                break;
            case "Topological":
                graph.reset_configuration();
                system.add_message(algo_name + ' algoritmus sa spustil', "start");
                this.#topological_sort();
                break;
            case "Bellman-Ford":
                graph.reset_configuration();
                this.#bellman_ford();
                break;
        }

    }

    /**
     * Make node visited
     * @param node
     */

    makeVisited(node) {
        node.addClass('visited');
        node.data('name', node.data().original_name + ' (navštívený)');
    }

    /**
     * Edit node's low key value
     * @param nodes
     * @param lkv
     */

    makeLVK(nodes, lkv) {
        $.each(nodes, function (index, node) {
            node.data('name', node.data().original_name + ' LKV: ' + lkv)
            system.add_message("Vrchol " + node.data().original_name + " patri do spoločnej komponenty: " + lkv);
        })
        system.add_message("---------------------------------------");
    }

    /**
     * Change node's income value
     * @param node
     */

    changeIncomesData(node) {
        node.data('name', node.data().original_name + ' Vstupujú: ' + node.data().incomes);
    }

    /**
     * Set all nodes infinite distance
     */

    changeInfiniteLabel() {
        let nodes = graph.get_elements().nodes();

        $.each(nodes, function (index, node) {
            node.data('name', '');
            node.data('name', node.data().original_name + ' vzdialenosť: ' + '∞');
        })
    }

    /**
     * Change node's distance
     * @param node
     * @param distance
     */

    changeDistanceAndPredecessor(node, distance) {
        node.data('name', '');
        node.data('name', node.data().original_name + ' vzdialenosť: ' + distance);
    }

    /**
     * Create components of given nodes
     * @param nodes
     */

    makeComponents(nodes) {
        $.each(nodes, function (index, ele) {
            let nodes = ele.nodes();
            let component = graph.add_component();
            nodes.move({parent: component.data('id')});
        })
    }

    /**
     * Check if graph is connected
     * @returns {boolean}
     */

    check_connectivity() {
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
            alert('Graf musí byť súvislý');
            return false;
        }
        return true;
    }

    /**
     * Make node explored
     * @param node
     */

    makeExplored(node) {
        node.removeClass('visited');
        node.addClass('explored');
        node.data('name', node.data().original_name + ' (odhalený)');
    }

    /**
     * Check if initial node
     * @returns {boolean}
     */

    checkForEmptyRoot() {
        if (system.node_select_value === "") {
            alert('Zvoľ počiatočný vrchol');
            return true;
        }
        return false;
    }

    /**
     * BFS algorithm
     */

    #breadth_first_search() {
        let edgesCollection = [];
        let nodesCollection = [];
        if (this.checkForEmptyRoot()) {
            return;
        }
        system.add_message('BFS algoritmus sa spustil', "start");

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

        let order = [];
        let self = this;

        while(nodesCollection.length !== 0) {
            let node = nodesCollection.shift();
            let edges = [];

            while (edgesCollection[0] !== undefined
            && (edgesCollection[0].source().data().id === node.data().id
                || edgesCollection[0].target().data().id === node.data().id)) {
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
                system.add_message("BFS algoritmus skončil", "end");
                return;
            }
            self.makeExplored(current_obj.node);
            system.add_message("Preskúmal vrchol: " + current_obj.node.data().original_name);
            real_queue.shift();

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
                                system.add_message("Navštívil vrchol: " + edge.target().data().original_name);
                            }
                        }
                        if (current_obj.node.data().id === edge.target().data().id) {
                            if (!edge.source().hasClass('visited') && !edge.source().hasClass('explored')) {
                                self.makeVisited(edge.source());

                                system.add_message("Visit node: " + edge.source().data().original_name);
                            }
                        }
                    }
                });
            })
            setTimeout(runBFSAnimation, self.#time);
        }
        runBFSAnimation();
    }

    /**
     * DFS algorithm
     */

    #depth_first_search() {
        let edgesCollection = [];
        let nodesCollection = [];
        let map = new Map();
        if (this.checkForEmptyRoot()) {
            return;
        }
        system.add_message('DFS algoritmus sa spustil', "start");
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
                system.add_message("Preskúmal vrchol: " + current_node.data().original_name);
                self.makeExplored(current_node);
                system.add_message("DFS algoritmus skončil", "end");
                return;
            }

            self.makeVisited(current_node);

            let succ_edge = current_node.data().succ.shift()
            if (succ_edge === undefined) {
                system.add_message("Preskúmal vrchol: " + current_node.data().original_name);
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
                        system.add_message("Navštívil vrchol: " + succ_edge[0].data().original_name);
                        self.makeVisited(succ_edge[0]);
                    }
                });

                current_node = succ_edge[0];
                setTimeout(runDFSAnimation, self.#time)
            }
        }
        runDFSAnimation();
    }

    /**
     * Bellman-Ford algorithm
     */

    #bellman_ford() {
        if (this.checkForEmptyRoot()) {
            return;
        }
        system.add_message('Bellman-Ford algoritmus sa spustil', "start");
        let node_count = graph.get_elements().nodes().length;
        graph.get_elements().nodes().map(node => node.data().bf = Infinity);
        graph.get_elements().nodes().map(node => node.data().predecessor = null);
        let root = graph.get_specific_node(system.node_select_value);
        let edges = graph.get_elements().edges();

        this.changeInfiniteLabel();
        root.data().bf = 0;
        root.data().predecessor = root;

        root.data('name', root.data().original_name + ' vzdialenosť: ' + root.data().bf);

        let count = 1;

        let result = [];

        for( ;; ) {
            if (count === node_count) {
                break;
            }

            $.each(edges, function (index, edge) {
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
                system.add_message("Bellman-Ford algoritmus skončil lebo existuje negatívny cyklus", "end");
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
                system.add_message("Bellman-Ford algoritmus skončil", "end");
                return;
            }

            let target = current_obj.target;
            let edge = current_obj.edge;

            target.addClass('bf');
            system.add_message("Relaxuje vrchol " + target.data().original_name + " na vzdialenosť: " + current_obj.new_distance);
            edge.style(
                {'line-color' : self.#animation_color,
                'target-arrow-color': self.#animation_color});

            self.changeDistanceAndPredecessor(target, current_obj.new_distance, current_obj.source);
            current_obj = result.shift();
            setTimeout(runBFAnimation, self.#time);

        }

        runBFAnimation();
    }

    /**
     * Kruskal algorithm
     */
    #kruskal() {
        graph.change_edges_directions(false);

        if (!this.check_connectivity()) {
            system.add_message("Kruskal algoritmus skončil", "end");
            return
        }

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
                system.add_message("Kruskal algoritmus skončil", "end");
                return;
            }

            let current_edge = edge_arr[0];

            system.add_message("Vyberá najmenšiu hranu: [" + current_edge.source().data().original_name + ', ' + current_edge.target().data().original_name + ']');
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

    /**
     * Expand collection
     * @param nodes
     * @returns {Collection|pa}
     */
    #expand_collection(nodes) {
        let new_collection = graph.make_collection();

        $.each(nodes, function (index, node) {
            let node_object = graph.get_specific_node(node);
            new_collection.merge(node_object.outgoers().edges()).merge(node_object.incomers().edges());
        })

        return new_collection;
    }

    /**
     * Prims algorithm
     */

    #prim() {
        if (this.checkForEmptyRoot()) {
            return;
        }
        if (!this.check_connectivity()) {
            system.add_message("Prim algoritmus skončil", "end");
            return
        }

        graph.change_edges_directions(false);
        system.add_message("Prim algoritmus sa spustil", "start");
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
                system.add_message("Prim algoritmus skončil", "end");
                return
            }
            system.add_message("Vyberá najmenšiu hranu: [" + current_edge.source().data().original_name + ', ' + current_edge.target().data().original_name + '] s váhou: ' + current_edge.data().weight);
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

    /**
     * Tarjan algorithm
     */

    #tarjan() {
        let self = this;
        let tsc = graph.get_elements().tarjanStronglyConnected();
        let result_obj = [];

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
                system.add_message("Tarjan algoritmus skončil", "end");
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

    /**
     * Topological sort
     */

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

        system.add_message("Khan algoritmus sa spustil", "start");
        let runKhanAnimation = function() {
            let current_node = anime.shift();
            if (current_node === undefined) {
                system.add_message("Khan algoritmus skončil", "end");
                system.add_message("Finálne topologické usporiadanie: " + result.map(node => node.data().original_name), "special");
                return;
            }

            if (current_node.data().incomes >= 0) {
                current_node.addClass('bf');
                if (current_node.data().incomes !== 0) {
                    current_node.data().incomes -= 1;
                    self.changeIncomesData(current_node);
                    system.add_message("Aktuálny vrchol " + current_node.data().original_name + " má " +  current_node.data().incomes + " vstupné vrcholy");
                    if (current_node.data().incomes === 0) {
                        r.push(current_node.data().original_name);
                        system.add_message("Vrchol " + current_node.data().original_name + " je vložený do fronty");
                        system.add_message("Fronta: " + r, "special");
                    }
                } else {
                    r.push(current_node.data().original_name);
                    system.add_message("Vrchol " + current_node.data().original_name + " je vložený do fronty");
                    system.add_message("Fronta: " + r, "special");
                }

                count++;

                setTimeout(runKhanAnimation, self.#time);
            }
        }
        runKhanAnimation();
    }

}