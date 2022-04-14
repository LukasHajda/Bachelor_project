class System {

    #backgroundColor_first;
    #backgroundColor_second;
    #node_select;
    #time;
    #log;
    #animation_color;

    constructor() {
        this.#backgroundColor_first = $('#backgroundColor-first');
        this.#backgroundColor_second = $('#backgroundColor-second');
        this.#node_select = $('.starting_node');
        this.#time = $('#time');
        this.#log = $('.log');
        this.#animation_color = $('#animation_color');
        this.set_events();
    }


    /**
     * Set events for inputs from events
     */

    set_events() {
        let self = this;
        $('.colorPick').change(function () {
            $("body").css({
                background : 'linear-gradient(' + $(self.#backgroundColor_first).val() + ',' + $(self.#backgroundColor_second).val() + ') no-repeat fixed'
            }, 200)
        });

        $('.outer').click(function() {
            let inner = $('.inner');
            inner.attr('data-check', ((inner.attr('data-check') === "0") ? "1" : "0"));
            if (inner.attr('data-check') === "1") {
                $(this).css({"background-color":"#9198e5", "transition":"background-color .4s ease"});
                inner.css("transform","translate(27px, 0)");
            } else {
                $(this).css({"background-color":"#ccc", "transition":"background-color .4s ease"});
                inner.css("transform","translate(0px, 0)");
            }
            graph.change_edges_directions(inner.attr('data-check') === "0");
        });

        $('#algorithm-select').on('change', function () {
            let value = $(this).val()

            if (['Tarjan', 'Kruskal', 'Topological'].includes(value)) {
                $('#initial_vertex').addClass('hide');
            } else {
                $('#initial_vertex').removeClass('hide');
            }
        });

        $('#js').on('click', function () {
            $.each(graph.get_elements(), function (index, ele) {
            })
        })
    }

    /**
     * Reset all colors inputs
     */

    reset_configuration() {
        $('#color4').val('#83b55a');
        $('#color3').val('#a83030');
        $('#backgroundColor-first').val('#e2d0d0');
        $('#backgroundColor-second').val('#949995');
        this.remove_log();
    }

    /**
     * Add nodeid attribute
     * @param obj
     */

    add_node_option(obj) {
        this.#node_select.attr('data-nodeid', obj.id);
        this.#node_select.text(obj.name);
    }

    /**
     * Hide when new element is added
     */

    hide_download_buttons() {
        if (!$('#python_download').hasClass('dwn_hide')) $('#python_download').addClass('dwn_hide');
        if (!$('#java_download').hasClass('dwn_hide')) $('#java_download').addClass('dwn_hide');
    }

    /**
     * Return id of selected node
     * @returns {*}
     */

    get node_select_value() {
        return this.#node_select.attr('data-nodeid');
    }

    /**
     * Directed / Undirected graph
     * @returns {boolean}
     */

    get get_direction() {
        return $('.inner').attr('data-check') === "0";
    }

    /**
     * Return parsed time
     * @returns {number}
     */

    get time_value() {
        return parseFloat(this.#time.val());
    }

    /**
     * Add message to log
     * @param message
     * @param variant
     */

    add_message(message, variant = null) {
        let weight_margin = 'font-weight:bold;margin-left:10px"';
        let style;
        switch (variant) {
            case "end":
                style = 'style="color:red;' + weight_margin;
                break;
            case "start":
                style = 'style="color:green;' + weight_margin;
                break;
            case "special":
                style = 'style="color:orange;' + weight_margin;
                break;
            default:
                style = 'style="' + weight_margin;
        }
        let p = '<p' + ' '  + style + '>' + message + '</p>';
        this.#log.append(p);
    }

    /**
     * Clear log
     */

    remove_log() {
        this.#log.empty();
    }

    /**
     * Get animation color
     * @returns {jQuery|string|undefined}
     */
    get animation_color() {
        return this.#animation_color.val();
    }

}