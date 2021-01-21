import tracer from 'dd-trace';

export { tracer };

tracer.init({ hostname: 'localhost' }).use('kafkajs');
