export function plantuml() {
    const text = `@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
    
Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
@enduml`

    const text1 = /@startuml|@enduml/g;
    const dom = text.replace(text1, "")
    let dom1 = dom.split("\n");
    let delmiters = ['->', '->x', '->>',]
    for (var i = 1; i < dom1.length - 1; i++) {
        if (dom1[i].split("->")) {
            console.log('yes');

        } else {
            console.log("no")
        }
        let dom = dom1[i].split("->")
        console.log(dom1[i].split("->"));
    }
    console.log(dom1)


}