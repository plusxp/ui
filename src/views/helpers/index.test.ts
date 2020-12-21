import {createView, defaultBuilderConfig} from 'src/views/helpers/index';
import {
    XYViewProperties,
    ScatterViewProperties,
    BandViewProperties,
    HeatmapViewProperties,
} from "../../client";
import {Base} from "../../types";

describe('intro test', () => {
    it('get the dbc...it should work', () =>{
        const foo = defaultBuilderConfig();
        expect(foo.buckets).toEqual([])
    })
})

describe('testing view refactoring/components', () => {

    const ticks = {
        generateXAxisTicks: [],
        generateYAxisTicks: [],
        xTotalTicks: null,
        xTickStart: null,
        xTickStep: null,
        yTotalTicks: null,
        yTickStart: null,
        yTickStep: null,
    };

    const checkTickProps = (graphProps) => {

        expect(graphProps.generateXAxisTicks).toEqual(ticks.generateXAxisTicks);
        expect(graphProps.generateYAxisTicks).toEqual(ticks.generateYAxisTicks);

        expect(graphProps.xTotalTicks).toEqual(ticks.xTotalTicks);
        expect(graphProps.yTotalTicks).toEqual(ticks.yTotalTicks);

        expect(graphProps.xTickStart).toEqual(ticks.xTickStart);
        expect(graphProps.yTickStart).toEqual(ticks.yTickStart);

        expect(graphProps.xTickStep).toEqual(ticks.xTickStep);
        expect(graphProps.yTickStep).toEqual(ticks.yTickStep);
    };

    it('xy configuration test should be the same', () => {
        const ack = createView<XYViewProperties>('xy').properties
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

    it("scatter tick prop test", () => {
        const scatterProps = createView<ScatterViewProperties>('scatter').properties;
        checkTickProps(scatterProps);
    })

});

