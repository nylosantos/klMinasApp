// import React, { useContext } from 'react';
// import PizZip from 'pizzip';
// import Docxtemplater from 'docxtemplater';
// import { saveAs } from 'file-saver';
// import { StudentSearchProps } from '../@types';
// import { GlobalDataContext, GlobalDataContextType } from '../context/GlobalDataContext';

// interface Props {
//     student: StudentSearchProps;
// }

// const GeneratePDF: React.FC<Props> = ({ student }) => {
//     // GET GLOBAL DATA
//     const { calculateStudentMonthlyFee, handleOneCurriculumDetails } = useContext(GlobalDataContext) as GlobalDataContextType;

//     const generateDocx = async () => {
//         try {
//             const response = await fetch(`/src/models/contratoKlMinas.docx`);
//             const blob = await response.blob();
//             const arrayBuffer = await blob.arrayBuffer();
//             const zip = new PizZip(arrayBuffer);

//             const doc = new Docxtemplater(zip, {
//                 paragraphLoop: true,
//                 linebreaks: true,
//             });

//             doc.setData(student);
//             doc.render();

//             const out = doc.getZip().generate({
//                 type: 'blob',
//                 mimeType:
//                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//             });
//             saveAs(out, `Contrato KL Minas - ${student.name}_${student.financialResponsible.name}.docx`);
//         } catch (error) {
//             console.error("Errore durante la generazione del documento:", error);
//         }
//     };

//     return (
//         <button
//             onClick={generateDocx}
//             className="px-4 py-2 rounded shadow hover:shadow-lg hover:bg-blue-600 transition disabled:opacity-50 bg-blue-500 text-white cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:none"
//         >
//             Genera Documento
//         </button>
//     );
// };

// export default GeneratePDF;

import React, { useContext } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { StudentSearchProps } from '../@types';
import { GlobalDataContext, GlobalDataContextType } from '../context/GlobalDataContext';

interface Props {
    student: StudentSearchProps;
}

const GeneratePDF: React.FC<Props> = ({ student }) => {
    // GET GLOBAL DATA
    const { calculateStudentMonthlyFee, handleOneCurriculumDetails } = useContext(GlobalDataContext) as GlobalDataContextType;

    const generateDocx = async () => {
        try {
            // 1. Filtra currículos válidos
            const validCurriculums = student.curriculums.filter(
                (curr) => !curr.isExperimental && !curr.isWaiting
            );

            // 2. Obtém preços detalhados com breakdown
            const feeData = await calculateStudentMonthlyFee(student.id, undefined, true);
            const breakdownArr = Array.isArray(feeData.breakdown) ? feeData.breakdown : [];

            // 3. Monta novo array de currículos enriquecidos
            const enrichedCurriculum = await Promise.all(
                validCurriculums.map(async (curr, index) => {
                    const details = await handleOneCurriculumDetails(curr.id);
                    const courseName = details?.schoolCourseName || 'Modalidade não encontrada';
                    const schoolName = details?.schoolName || 'Escola não encontrada';
                    const classDayName = details?.classDayName || 'Dias de aula não encontrados';
                    const prices = breakdownArr.find(b => b.curriculumId === curr.id) || { appliedPrice: 0, fullPrice: 0 };
                    const courseIndex = index + 1

                    // Exemplo: supondo curr.startDate é um timestamp em milissegundos
                    let formattedStartDate = '';
                    if (curr.date) {
                        formattedStartDate = curr.date.toDate().toLocaleDateString('pt-BR');
                    }

                    return {
                        ...curr,
                        courseIndex,
                        schoolCourse: courseName,
                        appliedPrice: prices.appliedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                        fullPrice: prices.fullPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                        school: schoolName,
                        classDays: classDayName,
                        formattedStartDate, // agora disponível para o template
                    };
                })
            );

            // 4. Cria nova versão do student
            const studentWithEnrichedCurriculum = {
                ...student,
                detailedCurriculum: enrichedCurriculum,
                fullPrice: student.fullPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                appliedPrice: student.appliedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            };

            console.log("Student with enriched curriculum:", studentWithEnrichedCurriculum);

            console.log(student.financialResponsible.name);
            console.log(student.financialResponsible.document);

            // 5. Carrega template do contrato
            const response = await fetch(`/src/models/contratoKlMinas.docx`);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const zip = new PizZip(arrayBuffer);

            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            // 6. Define os dados e gera o documento
            doc.setData(studentWithEnrichedCurriculum);
            doc.render();

            const out = doc.getZip().generate({
                type: 'blob',
                mimeType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            saveAs(out, `Contrato KL Minas - ${student.name}_${student.financialResponsible.name}.docx`);
        } catch (error) {
            console.error("Erro durante a geração do documento:", error);
        }
    };

    return (
        <button
            onClick={generateDocx}
            className="px-4 py-2 rounded shadow hover:shadow-lg hover:bg-blue-600 transition disabled:opacity-50 bg-blue-500 text-white cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:none"
        >
            Genera Documento
        </button>
    );
};

export default GeneratePDF;
