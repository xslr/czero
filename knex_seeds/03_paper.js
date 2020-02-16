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
  return knex.raw('TRUNCATE "papers" RESTART IDENTITY CASCADE; TRUNCATE "binaries" RESTART IDENTITY CASCADE;')
    .finally(function () {
      // Inserts seed entries
      return knex('papers').insert([
          { title: 'Comparison of the three CPU schedulers in Xen',      submitter_id: 1, presenter_id: 1, cid: 1, date_submitted: '2020-07-23', status: 'submitted'},
          { title: 'Scheduling for reduced CPU energy',                  submitter_id: 1, presenter_id: 2, cid: 1, date_submitted: '2020-07-23', status: 'in_review'},
          { title: 'Neural network credit scoring models',               submitter_id: 1, presenter_id: 3, cid: 2, date_submitted: '2020-07-23', status: 'await_final_draft'},
          { title: 'Distilling the knowledge in a neural network',       submitter_id: 2, presenter_id: 4, cid: 2, date_submitted: '2020-07-23', status: 'published'},
          { title: 'Neural network design for engineering applications', submitter_id: 2, presenter_id: 1, cid: 3, date_submitted: '2020-07-23', status: 'submitted'},
          { title: 'A general regression neural network',                submitter_id: 2, presenter_id: 2, cid: 3, date_submitted: '2020-07-23', status: 'in_review'},
          { title: 'Theory of the backpropagation neural network',       submitter_id: 3, presenter_id: 3, cid: 4, date_submitted: '2020-07-23', status: 'await_final_draft'},
          { title: 'Neural network-based face detection',                submitter_id: 3, presenter_id: 4, cid: 4, date_submitted: '2020-07-23', status: 'published'},
          { title: 'Recurrent neural network based language model',      submitter_id: 3, presenter_id: 1, cid: 1, date_submitted: '2020-07-23', status: 'in_review'},
          { title: 'A multilayered neural network controller',           submitter_id: 4, presenter_id: 2, cid: 1, date_submitted: '2020-07-23', status: 'await_final_draft'},
          { title: 'The Foundation of a Generic Theorem Prover',         submitter_id: 4, presenter_id: 3, cid: 1, date_submitted: '2020-07-23', status: 'await_final_draft'},
        ])
        .then(() => {
          const files = [
            '3schedulers-xen-summit_Cherkosova.pdf',
            'weiser94scheduling.pdf',
            'Neural_network_credit_scoring_models.pdf',
            '1503.02531.Distilling the Knowledge in a Neural Network.pdf',
            'Neural_network_design_for_engineering_ap.pdf',
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

          return knex('binaries').insert(records)
        })
        .then(() => {
          return knex('paper_revisions').insert([
            { paper_id: 1, paper_revision: 1, upload_id:1,  abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ligula mi, lobortis at auctor eu, interdum vitae purus. Ut consequat.' },
            { paper_id: 2, paper_revision: 1, upload_id:2,  abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean condimentum augue a mauris varius, vitae tristique enim rhoncus. Quisque vulputate.' },
            { paper_id: 3, paper_revision: 1, upload_id:3,  abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat dui eu dolor elementum, nec interdum lacus suscipit. Nulla ornare. ' },
            { paper_id: 4, paper_revision: 1, upload_id:4,  abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce massa erat, ultricies a massa id, consectetur accumsan massa. Praesent a. ' },
            { paper_id: 5, paper_revision: 1, upload_id:5,  abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta tellus non est scelerisque faucibus. Donec dui purus, scelerisque sit. ' },
            { paper_id: 1, paper_revision: 2, upload_id:12, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean felis diam, dictum at gravida id, condimentum non erat. Ut ornare. ' },
            { paper_id: 2, paper_revision: 2, upload_id:13, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id dapibus augue. Curabitur pharetra, odio in tempor sodales, sem mauris. ' },
            { paper_id: 3, paper_revision: 2, upload_id:14, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget libero vitae ligula eleifend finibus sed in urna. Vestibulum eget. ' },
            { paper_id: 4, paper_revision: 2, upload_id:15, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla est ac pulvinar eleifend. Maecenas non ultricies magna, sed faucibus. ' },
            { paper_id: 5, paper_revision: 2, upload_id:16, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vehicula tincidunt sem at pharetra. In et eleifend ipsum. Vestibulum sit. ' },
            { paper_id: 2, paper_revision: 3, upload_id:17, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rutrum ex ut elit tristique, convallis ultricies dolor sodales. Curabitur eget. ' },
            { paper_id: 2, paper_revision: 4, upload_id:18, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rutrum tristique diam, a euismod tellus ultricies quis. Nulla eget volutpat. ' },
            { paper_id: 2, paper_revision: 5, upload_id:19, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel felis sit amet sapien tincidunt consectetur in et dui. Nullam. ' },
            { paper_id: 3, paper_revision: 3, upload_id:20, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida tincidunt quam, et condimentum risus rutrum vitae. Ut tincidunt felis. ' },
            { paper_id: 4, paper_revision: 3, upload_id:21, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu lacus quis velit semper fringilla sit amet congue eros. Class. ' },
            { paper_id: 5, paper_revision: 3, upload_id:22, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sagittis aliquam urna, bibendum porttitor metus. Suspendisse porta vehicula nulla, vel. ' },
          ])
        })
    })
}
