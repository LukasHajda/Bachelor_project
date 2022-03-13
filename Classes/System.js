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
                console.log('dsdsdsd');
                $('#initial_vertex').addClass('hide');
            } else {
                $('#initial_vertex').removeClass('hide');
            }
        });

        $('#js').on('click', function () {
            $.each(graph.get_elements(), function (index, ele) {
                console.log(ele.json());
            })
        })
    }

    reset_configuration() {
        $('#color4').val('#83b55a');
        $('#color3').val('#a83030');
        $('#backgroundColor-first').val('#e2d0d0');
        $('#backgroundColor-second').val('#949995');
    }

    add_node_option(obj) {
        this.#node_select.attr('data-nodeid', obj.id);
        this.#node_select.text(obj.name);
    }

    get node_select_value() {
        return this.#node_select.attr('data-nodeid');
    }

    get get_direction() {
        return $('.inner').attr('data-check') === "0";
    }

    get time_value() {
        return parseFloat(this.#time.val());
    }

    add_message(message, variant = null) {
        let style = "";
        switch (variant) {
            case "end":
                style = 'style="font-weight:bold;;color:red;margin-left:10px"';
                break;
            case "start":
                style = 'style="font-weight:bold;color:green;margin-left:10px"';
                break;
            case "special":
                style = 'style="font-weight:bold;color:orange;margin-left:10px"';
                break;
            default:
                style = 'style="font-weight:bold;margin-left:10px"';
                break;
        }
        let p = '<p' + ' '  + style + '>' + message + '</p>';
        this.#log.append(p);
    }

    remove_log() {
        this.#log.empty();
    }

    get animation_color() {
        return this.#animation_color.val();
    }

}