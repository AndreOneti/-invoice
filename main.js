$save.addEventListener('click', _ => doc.save(docName));

function generatePDF() {
  doc = new jsPDF('l');
  const [first, second] = cliente.NAME.split(" ");
  docName = `ORÇAMENTO_${first}_${second}.pdf`;

  let numberOfPages = Math.ceil(itens.length / 25);
  if (itens.length % 25 === 0) numberOfPages++;
  let currPage = 0;
  let lastItem = 0;

  for (currPage; currPage < numberOfPages; currPage++) {
    //DRAW HEADER
    doc.setFontSize(15);
    doc.text("ORÇAMENTO", 120, 12);
    doc.setFontSize(7);
    doc.text(`Página ${currPage + 1} de ${numberOfPages}`, 220, 9);
    doc.text(`Emissão deste Doc.: ${this.dateNowFormatted()}`, 220, 12);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text(`Válido até: ${this.dateNextWeekFormmated()}`, 220, 16);

    //DRAW LOGO
    const ctx = Canvas.getContext('2d');
    ctx.drawImage(logo, 0, 0, 404, 83);
    const imgURL = Canvas.toDataURL();
    doc.addImage(imgURL, 'png', 10, 5, 80, 25);

    // DRAW LINES
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    doc.line(2, 2, 295, 2);
    doc.line(2, 22, 295, 22);
    doc.line(2, 2, 2, 22);
    doc.line(295, 2, 295, 22);

    doc.line(2, 24, 295, 24);
    doc.line(94, 24, 94, 60);
    doc.line(188, 24, 188, 60);
    doc.line(2, 60, 295, 60);

    doc.text(
      `FORNECEDOR\n\n${fornecedor.NAME
      }\n${fornecedor.ENDERECO
      }\n${fornecedor.CIDADE
      } - ${fornecedor.ESTADO
      }\nTEL.: ${fornecedor.TEL
      }\nCNPJ.: ${fornecedor.DOC
      }`,
      12,
      29
    );

    doc.text(
      `CLIENTE\n\n${cliente.NAME
      }\n${cliente.ENDERECO
      }\nCEP.:${cliente.CEP
      } - ${cliente.CIDADE
      } - ${cliente.ESTADO
      }\nCPF/CNPJ:${cliente.DOC
      }\nTEL.:${cliente.TEL
      }   \nEMAIL:${cliente.EMAIL
      }`,
      96,
      29
    );

    doc.text(`ORÇAMENTO\n\nEMISSÃO: ${this.dateNowFormatted()
      }\nCOND. PGTO: ${formPag
      }\nVENDEDOR: ${fornecedor.VENDEDOR
      }`,
      190,
      29
    );

    // LIST PRODUCTS HEADER
    doc.text(`Item`, 5, 64);
    doc.text(`Produto`, 15, 64);
    doc.text(`Descrição`, 50, 64);
    doc.text(`Qtd.`, 183, 64);
    doc.text(`Vlr. Uni.`, 200, 64);
    doc.text(`Vlr. Total.`, 228, 64);

    //LIST PRODUCTS
    doc.line(2, 67, 295, 67);
    doc.setFontSize(9);
    let y = 0;
    let offSet = 0;
    for (let i = lastItem; i < lastItem + 25; i++) {
      if (i === itens.length) break;
      y = 68 + 5 * (offSet + 1);
      doc.text(`${i + 1}`.twoDigits(), 5, y);
      doc.text(itens[i].PRODUTO, 15, y);
      doc.text(`${itens[i].DESCRIPTION.slice(0, 68)}`, 50, y);
      doc.text(`${itens[i].QUANTITY}`, 183, y);
      doc.text(`R$  ${itens[i].PRICE_REGULAR.format()}`, 200, y);
      doc.text(`R$  ${(itens[i].QUANTITY * itens[i].PRICE_REGULAR).format()}`, 228, y);
      if (i + 1 < lastItem + 25 && i + 1 !== itens.length) {
        doc.setLineDash([1, 1], 0);
        doc.line(2, y + 1.5, 295, y + 1.5);
        doc.setLineDash(0, 0);
      }
      offSet++;
    }
    lastItem += 25;
    doc.line(2, y + 3, 295, y + 3);

    doc.line(2, 24, 2, y + 3);
    doc.line(295, 24, 295, y + 3);

    if (currPage + 1 !== numberOfPages) {
      doc.addPage('a4', 'l');
    } else {
      if (itens.length % 25 === 0) y = 72;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(
        `Valor total do orçamento:   ${this.getTotalPrice()}`,
        10,
        y + 10
      );
    }
  }

  const out = doc.output();
  const url = 'data:application/pdf;base64,' + btoa(out);

  $pdfView.data = url;
}
