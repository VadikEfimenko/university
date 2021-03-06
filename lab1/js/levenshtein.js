

apply.onclick = function() {
    let temp_1 = document.getElementById("1");
    let string_1 = temp_1.value;

    let temp_2 = document.getElementById("2");
    let string_2 = temp_2.value;
    let div = document.createElement('div');
    div.className = "container";
    div.innerHTML += "<hr>";

    if (string_1 !== '' || string_2 !== '') {
        let myMatrix = getDistanceMatrix(string_1, string_2);
        isLevenshtein(myMatrix,string_1, string_2,div);
        myMatrix = damerauLevenstein(string_1, string_2,div);
        div.innerHTML += "<br>";

        div.innerHTML += "<b>Recursive Levenshtein: </b>";
        div.innerHTML += recursiveLevenshtein(string_1, string_2);
        div.innerHTML += "<hr>";
    }
    else {

        div.style.backgroundColor = "#FA8072";
        div.innerHTML = "<b>Input error!</b> Lines are empty!!\n";
        document.body.appendChild(div);
    }

    document.body.appendChild(div);
};

function getDistanceMatrix(string_1, string_2) {
    let lenOfFirstString = string_1.length;
    let lenOfSecondString = string_2.length;

    let levMatrix = [];

    for (let i = 0; i<=lenOfFirstString; i++)
        levMatrix[i] = [i];
    for (let j = 0; j<=lenOfSecondString; j++)
        levMatrix[0][j] = j;


    for (let i = 1; i<=lenOfFirstString; i++) {
        for (let j = 1; j<=lenOfSecondString; j++) {
           if (string_1[i-1] === string_2[j-1]) {
               levMatrix[i][j] = Math.min.apply({},[levMatrix[i][j-1],
                   levMatrix[i-1][j], levMatrix[i-1][j-1]]);
           }
           else {
               levMatrix[i][j] = Math.min.apply({},[levMatrix[i][j-1],
                   levMatrix[i-1][j], levMatrix[i-1][j-1]]) + 1;
           }
        }
    }
return levMatrix;
}

function isLevenshtein(myMatrix,string_1, string_2,div) {

    let div_2 = document.createElement('div');
    let div_1 = document.createElement('div');
    let isDistance = [];
    let isDistance_string1 = [];
    let isDistance_string2 = [];
    let choice;

    let i = string_1.length;
    let j = string_2.length;
    while (i && j) {
        let isInsert = myMatrix[i][j-1];
        let isDelete = myMatrix[i-1][j];
        let isChange = myMatrix[i-1][j-1];
        choice = Math.min.apply({},[isInsert, isDelete, isChange]);

        if (choice === isChange) {
            if (string_1[i - 1] === string_2[j - 1]) {
                isDistance.splice(0, 0, 'M');
            }
            else {
                isDistance.splice(0, 0, 'R');
            }

            isDistance_string1.splice(0, 0, string_1[i - 1]);
            isDistance_string2.splice(0, 0, string_2[j - 1]);
            i--;
            j--;
        }
        if (choice === isInsert) {
            isDistance.splice(0,0,'I');
            isDistance_string1.splice(0,0,'-');
            isDistance_string2.splice(0,0,string_2[j-1]);
            j--;

        }
        if (choice === isDelete) {
            isDistance.splice(0,0,'D');
            isDistance_string2.splice(0,0,'-');
            isDistance_string1.splice(0,0,string_1[i-1]);
            i--;

        }

    }



    div_1.className = "container_div";
    div_2.className = "container_div";

    div_1.innerHTML = "<b>" + isDistance + "</b>";
    div_1.innerHTML += "<br>";
    div_1.innerHTML += isDistance_string1;
    div_1.innerHTML += "<br>";
    div_1.innerHTML += isDistance_string2;
    div_1.innerHTML += "<br>";

    for (let i=0; i<=string_1.length; i++) {
        div_2.innerHTML += myMatrix[i];
        div_2.innerHTML += "<br>";
    }

    div.appendChild(div_1);
    div.appendChild(div_2);
    div.innerHTML += "<hr>";
    div.innerHTML += "<b>Levenshtein: </b>";
    div.innerHTML += myMatrix[string_1.length][string_2.length];
    div.innerHTML += "<br>";

}

function recursiveLevenshtein(string_1, string_2) {
    function calcDistance(i, j) {
        if (i === j && j === 0)
            return 0;
        if (i === 0 && j > 0)
            return j;
        if (j === 0 &&  i > 0)
            return i;

        return Math.min.apply({}, [calcDistance(i- 1,j) + 1, calcDistance(i, j - 1) + 1,
            calcDistance(i - 1,j - 1) + (string_1[i - 1] === string_2[j - 1] ? 0 : 1)]);
        
    }
    return calcDistance(string_1.length+1, string_2.length+1);
}

function damerauLevenstein(string_1, string_2,div)
{
    let letMatrix = [];
    let x = string_1.length + 1;
    let y = string_2.length + 1;

    for(let i = 0; i < x; i++)
        letMatrix[i] = i;
    for(let j = 0; j < y; j++)
        letMatrix[j*x] = j;
    for(let j = 1; j < y; j++)
    {
        for(let i = 1; i < x; i++)
        {
            let cost = string_1[i-1] === string_1[j-1] ? 0 : 1; // replace
            letMatrix[i + j * x] = Math.min
            (
                letMatrix[i-1 + j*x] + 1, // delete
                letMatrix[i+(j-1)*x] + 1, // inseration
                letMatrix[i-1 + (j-1)*x] + cost
            );

            if (i > 0 && j > 1 && string_1[i-1] === string_2[i-2] && string_1[i-2] === string_2[i-1])
            {
                letMatrix[i + j*x] = Math.min
                (
                    letMatrix[i + j*x],
                    letMatrix[i-2 + (j-2)*x] + 1 // transpotion
                );
            }

        }
    }
    div.innerHTML += "<b>Damerau-Levenshtein: </b>";
    div.innerHTML += letMatrix[string_2.length * string_1.length];
    return letMatrix;
}

