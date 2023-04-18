// CARD para visualizar solicitações
// fica nas cores: verde para aceito, vermelho para recusado e cinza para pendente

import React from 'react';
import { DivSpaceAround, ElementoLI, SpanLI, ULHorizontal } from '../layout';


const SolicitacaoBox = ({ data }) => {
    
    const corDaBorda = (status) => {
        if (status === 'aceito') {
            return '#1E7443';
        } else if (status === 'recusado') {
            return '#C70000';
        } else {
            return '#282928';
        }
    }

    return (
        <section style={{ display: "flex", flexDirection: "row" }}>
        {data.map((item, index) => {
          return (
            <ULHorizontal key={index} style={{
              flexDirection: "column",
              borderLeft: `5px solid ${corDaBorda(item.status)}`,
              padding: "1em",
              width: "250px",
              boxShadow: "1px 5px 5px 5px #F0F0F0"

            }}>
                <span>Solicitação#{item.id} </span>
              <li style={{ flexDirection: "row", width: "100%", padding: "0.3em", paddingLeft: "0.9em" }}>
                <DivSpaceAround style={{ width: "100%" }}>
                  <SpanLI style={{ fontWeight: "lighter" }}>
                    nome
                  </SpanLI>
                  <span>
                    {item.nome}
                  </span>
                </DivSpaceAround>
              </li>
              <li style={{ flexDirection: "row", width: "100%", padding: "0.3em", paddingLeft: "0.9em" }}>
                <DivSpaceAround style={{ width: "100%" }}>
                  <SpanLI style={{ fontWeight: "lighter" }}>
                    solicitação de décimo terceiro
                  </SpanLI>
                  <span>
                    {item.solicitaDecimoTerceiro}
                  </span>
                </DivSpaceAround>
              </li>
              <li style={{ flexDirection: "row", width: "100%", padding: "0.3em", paddingLeft: "0.9em" }}>
                <DivSpaceAround style={{ width: "100%" }}>
                  <SpanLI style={{ fontWeight: "lighter" }}>
                    solicitação de férias
                  </SpanLI>
                  <span>
                    {item.solicitaFerias}
                  </span>
                </DivSpaceAround>
              </li>
              <li style={{ flexDirection: "row", width: "100%", padding: "0.3em", paddingLeft: "0.9em" }}>
                <DivSpaceAround style={{ width: "100%" }}>
                  <SpanLI style={{ fontWeight: "lighter" }}>
                    data de início
                  </SpanLI>
                  <span>
                    {item.dataInicio}
                  </span>
                </DivSpaceAround>
              </li>
              <li style={{ flexDirection: "row", width: "100%", padding: "0.3em", paddingLeft: "0.9em" }}>
                <DivSpaceAround style={{ width: "100%" }}>
                  <SpanLI style={{ fontWeight: "lighter" }}>
                    data de fim
                  </SpanLI>
                  <span>
                    {item.dataFim}
                  </span>
                </DivSpaceAround>
              </li>
            </ULHorizontal>
          );
        })}
  
      </section>
    );
}

export default SolicitacaoBox;