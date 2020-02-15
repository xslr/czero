
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE "tblPaper" RESTART IDENTITY CASCADE')
    .finally(function () {
      // Inserts seed entries
      return knex('tblPaper').insert([
          { title: 'Comparison of the three CPU schedulers in Xen', submitterId: 1, presenterId: 1, cid: 1, dateSubmitted: '2020-07-23', status: 'submitted'},
          { title: 'Scheduling for reduced CPU energy',             submitterId: 1, presenterId: 2, cid: 1, dateSubmitted: '2020-07-23', status: 'in_review'},
          { title: 'Neural network credit scoring models',          submitterId: 1, presenterId: 3, cid: 2, dateSubmitted: '2020-07-23', status: 'await_final_draft'},
          { title: 'Distilling the knowledge in a neural network',  submitterId: 2, presenterId: 4, cid: 2, dateSubmitted: '2020-07-23', status: 'published'},
          { title: 'Neural network design',                         submitterId: 2, presenterId: 1, cid: 3, dateSubmitted: '2020-07-23', status: 'submitted'},
          { title: 'A general regression neural network',           submitterId: 2, presenterId: 2, cid: 3, dateSubmitted: '2020-07-23', status: 'in_review'},
          { title: 'Theory of the backpropagation neural network',  submitterId: 3, presenterId: 3, cid: 4, dateSubmitted: '2020-07-23', status: 'await_final_draft'},
          { title: 'Neural network-based face detection',           submitterId: 3, presenterId: 4, cid: 4, dateSubmitted: '2020-07-23', status: 'published'},
          { title: 'Recurrent neural network based language model', submitterId: 3, presenterId: 1, cid: 1, dateSubmitted: '2020-07-23', status: 'in_review'},
          { title: 'A multilayered neural network controller',      submitterId: 4, presenterId: 2, cid: 1, dateSubmitted: '2020-07-23', status: 'await_final_draft'},
          { title: 'Practical neural network recipes in C++',       submitterId: 4, presenterId: 3, cid: 1, dateSubmitted: '2020-07-23', status: 'await_final_draft'},
        ])
        .then(() => {
          return knex('tblPaperRevision').insert([
            { paperId: 1, revisionNumber: 1, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ligula mi, lobortis at auctor eu, interdum vitae purus. Ut consequat.' },
            { paperId: 2, revisionNumber: 1, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean condimentum augue a mauris varius, vitae tristique enim rhoncus. Quisque vulputate.' },
            { paperId: 3, revisionNumber: 1, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat dui eu dolor elementum, nec interdum lacus suscipit. Nulla ornare. ' },
            { paperId: 4, revisionNumber: 1, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce massa erat, ultricies a massa id, consectetur accumsan massa. Praesent a. ' },
            { paperId: 5, revisionNumber: 1, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta tellus non est scelerisque faucibus. Donec dui purus, scelerisque sit. ' },
            { paperId: 1, revisionNumber: 2, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean felis diam, dictum at gravida id, condimentum non erat. Ut ornare. ' },
            { paperId: 2, revisionNumber: 2, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id dapibus augue. Curabitur pharetra, odio in tempor sodales, sem mauris. ' },
            { paperId: 3, revisionNumber: 2, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget libero vitae ligula eleifend finibus sed in urna. Vestibulum eget. ' },
            { paperId: 4, revisionNumber: 2, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla est ac pulvinar eleifend. Maecenas non ultricies magna, sed faucibus. ' },
            { paperId: 5, revisionNumber: 2, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vehicula tincidunt sem at pharetra. In et eleifend ipsum. Vestibulum sit. ' },
            { paperId: 2, revisionNumber: 3, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rutrum ex ut elit tristique, convallis ultricies dolor sodales. Curabitur eget. ' },
            { paperId: 2, revisionNumber: 4, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rutrum tristique diam, a euismod tellus ultricies quis. Nulla eget volutpat. ' },
            { paperId: 2, revisionNumber: 5, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel felis sit amet sapien tincidunt consectetur in et dui. Nullam. ' },
            { paperId: 3, revisionNumber: 3, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida tincidunt quam, et condimentum risus rutrum vitae. Ut tincidunt felis. ' },
            { paperId: 4, revisionNumber: 3, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu lacus quis velit semper fringilla sit amet congue eros. Class. ' },
            { paperId: 5, revisionNumber: 3, abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sagittis aliquam urna, bibendum porttitor metus. Suspendisse porta vehicula nulla, vel. ' },
          ])
        })
    })
}
