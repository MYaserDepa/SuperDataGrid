// export default function (ctx) {
//     return `
//       <div ref="rating">
//         ${(function () {
//             let icons = '';
//             for (let i = 0; i < ctx.numberOfIcons; i++) {
//                 icons += `
//                 <i style="color: ${ctx.component.color}; font-size: ${ctx.component.iconSize}"
//                 class="${ctx.component.icon}${i < ctx.filledIcons ? '-fill' : ''}" 
//                 ref="icon"></i>`;
//             }
//             return icons;
//         })()}
//       </div>
//     `
// }
export default function (ctx) {
  return `
      <div ref="dataPager"></div>
    `
}