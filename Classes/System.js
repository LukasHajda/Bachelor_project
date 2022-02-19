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
}