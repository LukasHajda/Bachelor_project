class System {

    #backgroundColor_first;
    #backgroundColor_second;
    #node_select;

    constructor() {
        this.#backgroundColor_first = $('#backgroundColor-first');
        this.#backgroundColor_second = $('#backgroundColor-second');
        this.#node_select = $('.starting_node');
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
    }

    reset_configuration() {
        $('#color4').val('#83b55a');
        $('#color3').val('#a83030');
        $('#backgroundColor-first').val('#e2d0d0');
        $('#backgroundColor-second').val('#949995');
    }

    add_node_option(obj) {
        console.log(obj);
        this.#node_select.attr('data-nodeid', obj.id);
        this.#node_select.text(obj.name);
    }

    get node_select_value() {
        return this.#node_select.attr('data-nodeid');
    }

    get get_direction() {
        return $('.inner').attr('data-check') === "0";
    }

}