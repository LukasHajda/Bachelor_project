class CodeGenerator {

    #option;
    constructor() {
        this.#option = null;
    }

    generate_python_code() {
        this.#option = 1;
        let inputValue = "class Graph:\n" +
            "       def __init__(self, size):\n" +
            "              self.size = size\n" +
            "              self.table = [[] for _ in range(size)]\n" +
            "\n" +
            "graph = Graph(____)\n" +
            "graph.table = [++++]";

        let formatted_value = this.#generate_value(inputValue, ['[', ']']);
        this.file_configuration(formatted_value);
    }

    generate_java_code() {
        this.#option = 2;
        let inputValue = "public class Graph {\n" +
            "  private int[][] matrix;\n" +
            "  private int size;\n" +
            "\n" +
            "  public Graph(int size, int[][] matrix) {\n" +
            "    this.size = size;\n" +
            "    this.matrix = matrix;\n" +
            "  }\n" +
            "\n" +
            "  public int[][] getMatrix() {\n" +
            "    return matrix;\n" +
            "  }\n" +
            "\n" +
            "\n" +
            "  public int getSize() {\n" +
            "    return size;\n" +
            "  }\n" +
            "\n" +
            "\n" +
            "  public static void main(String args[]) {\n" +
            "    int[][] matrix = {++++};   \n" +
            "    Graph graph = new Graph(____, matrix);\n" +
            "\n" +
            "  }\n" +
            "}"

        let formatted_value = this.#generate_value(inputValue, ['{', '}']);
        this.file_configuration(formatted_value);
    }

    file_configuration(formatted_value) {
        const file = this.#createFileObj(formatted_value, "java_graph");
        const reader = new FileReader();
        reader.onload = this.#option === 1 ? this.#applyDataUrlToAnchorPython : this.#applyDataUrlToAnchorJava;
        reader.readAsDataURL(file);
    }

    #createFileObj(content){
        return new File(
            [content],
            '' + (this.#option === 1) ? 'python_graph.txt' : 'java_graph.txt',
            {type: "text/plain"}
        );
    }

    #applyDataUrlToAnchorPython(e){
        let a = $('#python_download');
        a.attr('href', e.target.result);
        a.removeClass('dwn_hide');
    };

    #applyDataUrlToAnchorJava(e){
        let a = $('#java_download');
        a.attr('href', e.target.result);
        a.removeClass('dwn_hide');
    };

    #generate_value(text, brackets) {
        let new_text = text;
        let nodes_count = graph.get_elements().nodes().length;
        let directed = system.get_direction;
        let nodes = graph.get_elements().nodes();
        let edges = graph.get_elements().edges();

        let map = new Map();
        let count = 0;
        let matrix = Array(nodes_count).fill().map(() => Array(nodes_count).fill(null));


        $.each(nodes, function (index, node) {
            if (!map.has(node.data().id)) {
                map.set(node.data().id, count++);
            }
        });

        $.each(edges, function (index, edge) {
            let source = edge.source().data().id;
            let target = edge.target().data().id;
            if (directed) {
                matrix[map.get(source)][map.get(target)] = edge.data().weight;
            } else {
                matrix[map.get(source)][map.get(target)] = edge.data().weight;
                matrix[map.get(target)][map.get(source)] = edge.data().weight;
            }
        })

        // generate matrix for python:
        let final = "";
        let arr_text = brackets[0];
        $.each(matrix, function (main_index, arr) {
            arr_text = (main_index === 0) ? brackets[0] : '       ' + brackets[0];
            $.each(arr, function (index, weight) {
                if (weight === null) {
                    arr_text += (index === nodes_count - 1) ? '0' : '0, ';
                } else {
                    arr_text += (index === nodes_count - 1) ? weight : weight + ', ';
                }
            })
            arr_text += (main_index !== nodes_count - 1) ? brackets[1] + ',' : brackets[1];
            final += arr_text + ((main_index !== nodes_count - 1) ? "\n" : '');
        })

        new_text = new_text.replace('++++', final);
        new_text = new_text.replace('____', nodes_count);

        return new_text;

    }

}