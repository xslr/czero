var fs = require('fs')

function getBlobContents(name) {
  try {
    const contents = fs.readFileSync(__dirname + '/blobs/' + name)
    // console.log(`contentLength for ${name} = ${contents.length}`)
    return contents
  } catch (e) {
    console.log(`e = ${e}`)
  }
}

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE "tblPaper" RESTART IDENTITY CASCADE; TRUNCATE "tblBinaries" RESTART IDENTITY CASCADE;')
    .finally(function () {
      // Inserts seed entries
      return knex('tblPaper').insert([
          { title: 'Comparison of the three CPU schedulers in Xen',      submitterId: 1, presenterId: 1, cid: 1, dateSubmitted: '2020-07-23', status: 'submitted'},
          { title: 'Scheduling for reduced CPU energy',                  submitterId: 1, presenterId: 2, cid: 1, dateSubmitted: '2020-07-23', status: 'in_review'},
          { title: 'Neural network credit scoring models',               submitterId: 1, presenterId: 3, cid: 2, dateSubmitted: '2020-07-23', status: 'await_final_draft'},
          { title: 'Distilling the knowledge in a neural network',       submitterId: 2, presenterId: 4, cid: 2, dateSubmitted: '2020-07-23', status: 'published'},
          { title: 'Neural network design for engineering applications', submitterId: 2, presenterId: 1, cid: 3, dateSubmitted: '2020-07-23', status: 'submitted'},
          { title: 'A general regression neural network',                submitterId: 2, presenterId: 2, cid: 3, dateSubmitted: '2020-07-23', status: 'in_review'},
          { title: 'Theory of the backpropagation neural network',       submitterId: 3, presenterId: 3, cid: 4, dateSubmitted: '2020-07-23', status: 'await_final_draft'},
          { title: 'Neural network-based face detection',                submitterId: 3, presenterId: 4, cid: 4, dateSubmitted: '2020-07-23', status: 'published'},
          { title: 'Recurrent neural network based language model',      submitterId: 3, presenterId: 1, cid: 1, dateSubmitted: '2020-07-23', status: 'in_review'},
          { title: 'A multilayered neural network controller',           submitterId: 4, presenterId: 2, cid: 1, dateSubmitted: '2020-07-23', status: 'await_final_draft'},
          { title: 'The Foundation of a Generic Theorem Prover',         submitterId: 4, presenterId: 3, cid: 1, dateSubmitted: '2020-07-23', status: 'await_final_draft'},
        ])
        .then(() => {
          const files = [
            '3schedulers-xen-summit_Cherkosova.pdf',
            'weiser94scheduling.pdf',
            'Neural_network_credit_scoring_models.pdf',
            '1503.02531.Distilling the Knowledge in a Neural Network.pdf',
            'Neural_network_design_for_engineering_ap.pdf',s
            'A_General_Regression_Neural_Network.pdf',
            'Theory of the backpropagation neural network.backprop.pdf',
            'Neural network-based face detection.a366182.pdf',
            'Recurrent neural network based language model.i10_1045.pdf',
            'A Multilayered Neural Network Controller.IEEE_8_17_Apr1988.pdf',
            'The Foundation of a Generic Theorem Prover.9301105.pdf',
            '3schedulers-xen-summit_Cherkosova.pdf',
            'weiser94scheduling.pdf',
            'Neural_network_credit_scoring_models.pdf',
            '1503.02531.Distilling the Knowledge in a Neural Network.pdf',
            'Neural_network_design_for_engineering_ap.pdf',
            'weiser94scheduling.pdf',
            'weiser94scheduling.pdf',
            'weiser94scheduling.pdf',
            'Neural_network_credit_scoring_models.pdf',
            '1503.02531.Distilling the Knowledge in a Neural Network.pdf',
            'Neural_network_design_for_engineering_ap.pdf',
            ]

          let records = []
          for (f of files) {
            records.push({ name: f, mime_type: 'application/pdf', object: getBlobContents(f) })
          }

          return knex('tblBinaries').insert(records)
        })
        .then(() => {
          return knex('tblPaperRevision').insert([
            { paperId: 1, revisionNumber: 1, uploadId:1, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ligula mi, lobortis at auctor eu, interdum vitae purus. Ut consequat.' },
            { paperId: 2, revisionNumber: 1, uploadId:2, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean condimentum augue a mauris varius, vitae tristique enim rhoncus. Quisque vulputate.' },
            { paperId: 3, revisionNumber: 1, uploadId:3, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat dui eu dolor elementum, nec interdum lacus suscipit. Nulla ornare. ' },
            { paperId: 4, revisionNumber: 1, uploadId:4, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce massa erat, ultricies a massa id, consectetur accumsan massa. Praesent a. ' },
            { paperId: 5, revisionNumber: 1, uploadId:5, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta tellus non est scelerisque faucibus. Donec dui purus, scelerisque sit. ' },
            { paperId: 1, revisionNumber: 2, uploadId:12, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean felis diam, dictum at gravida id, condimentum non erat. Ut ornare. ' },
            { paperId: 2, revisionNumber: 2, uploadId:13, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id dapibus augue. Curabitur pharetra, odio in tempor sodales, sem mauris. ' },
            { paperId: 3, revisionNumber: 2, uploadId:14, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget libero vitae ligula eleifend finibus sed in urna. Vestibulum eget. ' },
            { paperId: 4, revisionNumber: 2, uploadId:15, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla est ac pulvinar eleifend. Maecenas non ultricies magna, sed faucibus. ' },
            { paperId: 5, revisionNumber: 2, uploadId:16, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vehicula tincidunt sem at pharetra. In et eleifend ipsum. Vestibulum sit. ' },
            { paperId: 2, revisionNumber: 3, uploadId:17, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rutrum ex ut elit tristique, convallis ultricies dolor sodales. Curabitur eget. ' },
            { paperId: 2, revisionNumber: 4, uploadId:18, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rutrum tristique diam, a euismod tellus ultricies quis. Nulla eget volutpat. ' },
            { paperId: 2, revisionNumber: 5, uploadId:19, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel felis sit amet sapien tincidunt consectetur in et dui. Nullam. ' },
            { paperId: 3, revisionNumber: 3, uploadId:20, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida tincidunt quam, et condimentum risus rutrum vitae. Ut tincidunt felis. ' },
            { paperId: 4, revisionNumber: 3, uploadId:21, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu lacus quis velit semper fringilla sit amet congue eros. Class. ' },
            { paperId: 5, revisionNumber: 3, uploadId:22, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sagittis aliquam urna, bibendum porttitor metus. Suspendisse porta vehicula nulla, vel. ' },
          ])
        })
    })
}
