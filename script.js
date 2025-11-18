//  Tela de envio PIX
if (document.body.classList.contains("pagina-pix")) {

    function atualizarStatus(texto, corFundo, corTexto) {
        const btnStatus = document.querySelector(".btn-status");

        // muda para o estado atual
        btnStatus.textContent = texto;
        btnStatus.style.backgroundColor = corFundo;
        btnStatus.style.color = corTexto;

        // após 3 segundos, volta ao normal
        setTimeout(() => {
            btnStatus.textContent = "Aguardando transação...";
            btnStatus.style.backgroundColor = "#dfdede";
            btnStatus.style.color = "#081E45";
        }, 3000);
    }

    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const de = document.getElementById("from").value;
        const para = document.getElementById("to").value;
        const valor = Number(document.getElementById("valor").value);

        // PEGAR DATA E HORA
        const agora = new Date();
        const data = agora.toLocaleDateString("pt-BR");
        const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        // REGRAS DE DETECÇÃO
        let status = "Aprovado";
        const valorAlto = valor > 3000;
        const horarioSuspeito = agora.getHours() < 5;

        if (valorAlto || horarioSuspeito) {
            status = "Suspeito";
            atualizarStatus("🚨Transação suspeita detectada!", "#FF2E2E", "#ffffffff");
        } else {
            atualizarStatus("Transação concluída com sucesso!", "#49B559", "#003314");
        }

        // SALVAR NO EXTRATO
        const novaTransacao = { data, hora, de, para, valor, status };

        const extrato = JSON.parse(localStorage.getItem("extrato")) || [];
        extrato.push(novaTransacao);
        localStorage.setItem("extrato", JSON.stringify(extrato));

        form.reset();
    });
}

//  Tela do extrato
if (document.body.classList.contains("pagina-extrato")) {

    const corpoTabela = document.getElementById("extrato-corpo");
    const extrato = JSON.parse(localStorage.getItem("extrato")) || [];

    extrato.forEach(item => {
        const tr = document.createElement("tr");

        // cor da linha conforme status
        tr.style.background = item.status === "Suspeito"
            ? "#ffd6d6" // vermelho claro
            : "#d4f7df"; // verde claro

        tr.innerHTML = `
            <td>${item.data}</td>
            <td>${item.hora}</td>
            <td>${item.de}</td>
            <td>${item.para}</td>
            <td>R$ ${item.valor.toFixed(2)}</td>
            <td>${item.status}</td>
        `;

        corpoTabela.appendChild(tr);
    });
}
