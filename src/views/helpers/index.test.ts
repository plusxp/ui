import {createView, defaultBuilderConfig} from 'src/views/helpers/index';
import {Axis, XYViewProperties, BandViewProperties, HeatmapViewProperties} from "../../client";
import {Base} from "../../types";

describe('intro test', () => {
    it('get the dbc...it should work', () =>{
        const foo = defaultBuilderConfig();
        expect(foo.buckets).toEqual([])
    })
})

describe('test 2...playing with views', () => {
    const ack = createView<XYViewProperties>('xy').properties
   // console.log("view???", ack);

    const axes  =  {
            x: {
                bounds: ['', ''],
                label: '',
                prefix: '',
                suffix: '',
                base: '10',
                scale: 'linear',
            },
            y: {
                bounds: ['', ''],
                label: '',
                prefix: '',
                suffix: '',
                base: '10' as Base,
                scale: 'linear',
            },
        };

    const ticks = {
        xTotalTicks: null,
        xTickStart: null,
        xTickStep: null,
        yTotalTicks: null,
        yTickStart: null,
        yTickStep: null,
    };

    const checkTickProps = (graphProps) => {
        //console.log('hi iam inside, with graphprops', graphProps);

        expect(graphProps.xTotalTicks).toEqual(ticks.xTotalTicks);
        expect(graphProps.yTotalTicks).toEqual(ticks.yTotalTicks);

        expect(graphProps.xTickStart).toEqual(ticks.xTickStart);
        expect(graphProps.yTickStart).toEqual(ticks.yTickStart);

        expect(graphProps.xTickStep).toEqual(ticks.xTickStep);
        expect(graphProps.yTickStep).toEqual(ticks.yTickStep);
    };




    it('xy configuration test should be the same', () => {
        checkTickProps(ack);
   })

    it('band properties (ticks) test', () => {
        const bandProps = createView<BandViewProperties>('band').properties
        checkTickProps(bandProps);
    })

    it('heatmap tick property test', () => {
      const heatProps = createView<HeatmapViewProperties>('heatmap').properties
      checkTickProps(heatProps);
    })






});

