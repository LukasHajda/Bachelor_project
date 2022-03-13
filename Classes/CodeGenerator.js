class CodeGenerator {

    constructor() {
    }

    generate_python_code() {
        let inputValue = "class Graph:\n" +
            "       def __init__(self, size):\n" +
            "              # pocet vrcholov\n" +
            "              self.size = size\n" +
            "              self.table = [[] for _ in range(size)]\n" +
            "\n" +
            "graph = Graph(____)\n" +
            "graph.table = [++++]";

        let formatted_value = this.#python_generate_value(inputValue);
        const file = this.#createFileObj(inputValue, "python_graph");
        const reader = new FileReader();

        reader.onload = this.#applyDataUrlToAnchor;

        reader.readAsDataURL(file);
    }

    generate_java_code() {

    }

    #createFileObj(content){
        return new File(
            [content],
            `python_graph.txt`,
            {type: "text/plain"}
        );
    }

    #applyDataUrlToAnchor(e){
        let a = $('#python_download');
        a.attr('href', e.target.result);
        a.removeClass('dwn_hide');
    };

    #python_generate_value(text) {
        let nodes_count = graph.get_elements().nodes().length;
        let directed = system.get_direction;



    }

}