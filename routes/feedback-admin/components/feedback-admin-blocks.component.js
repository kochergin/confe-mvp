module.exports = class {
    onCreate(input) {
        this.state = {
            blocks: input.blocks,
        };
    }
    onMount() {
        Chart.defaults.global.defaultFontSize = parseInt( $('body').css('fontSize'), 10 );

        for( var b = 0; b < this.state.blocks.length; b++ ) {
            for( var q = 0; q < this.state.blocks[b].questions.length; q++ ) {
                if( this.state.blocks[b].questions[q].type == 'variants' ) {
                    var ctx = document.getElementById('feedbackCanvas'+this.state.blocks[b]._id+'_'+this.state.blocks[b].questions[q].question_id).getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: this.state.blocks[b].questions[q].variants,
                            datasets: [{
                                label: 'Ответы',
                                backgroundColor: '#004b8d',
                                borderColor: '#004b8d',
                                borderWidth: 0,
                                data: this.state.blocks[b].questions[q].statistics
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: {
                                display: false,
                            },
                            title: {
                                display: false,
                                text: this.state.blocks[b].questions[q].title
                            }
                        }
                    });
                }
            }
        }

        /*
        this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=feedback-admin', {
            // default
        });

        var that = this;

        this.primus.on('data', function message(data) {
            console.log('message from the server: ', data);

            if(data.message_type == 'give/feedback/success') {
                
            }
        });
        */
    }
}