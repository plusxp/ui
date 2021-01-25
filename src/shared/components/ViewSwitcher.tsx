// Libraries
import React, {FunctionComponent} from 'react'
import {Plot, FromFluxResult} from '@influxdata/giraffe'

// Components
import GaugeChart from 'src/shared/components/GaugeChart'
import SingleStat from 'src/shared/components/SingleStat'
import TableGraphs from 'src/shared/components/tables/TableGraphs'
import HistogramPlot from 'src/shared/components/HistogramPlot'
import HeatmapPlot from 'src/shared/components/HeatmapPlot'
import MosaicPlot from 'src/shared/components/MosaicPlot'
import FluxTablesTransform from 'src/shared/components/FluxTablesTransform'
import XYPlot from 'src/shared/components/XYPlot'
import ScatterPlot from 'src/shared/components/ScatterPlot'
import LatestValueTransform from 'src/shared/components/LatestValueTransform'
import CheckPlot from 'src/shared/components/CheckPlot'
import BandPlot from 'src/shared/components/BandPlot'
import GeoPlot from 'src/shared/components/GeoPlot'

// Types
import {
  Annotation,
  CheckViewProperties,
  QueryViewProperties,
  SingleStatViewProperties,
  StatusRow,
  TimeZone,
  XYViewProperties,
  TimeRange,
  CheckType,
  Threshold,
  Theme,
} from 'src/types'

interface Props {
  giraffeResult: FromFluxResult
  files?: string[]
  properties: QueryViewProperties | CheckViewProperties
  timeZone: TimeZone
  statuses?: StatusRow[][]
  timeRange?: TimeRange | null
  checkType?: CheckType
  checkThresholds?: Threshold[]
  theme: Theme
  annotations?: Annotation[]
}


const testAnnotations =  [{
  title:'first annotation',
  description:'hi i am a description (test1)',
  startValue:1610402328554,
  stopValue:1610402328554,
  dimension: 'x'
},
  {   title:'second annotation',
    description:'hi i am a description too (test2)',
    color:'steelblue',
    startValue:30,
    stopValue:30,
    dimension: 'y'
  },

  {   title:'third annotation',
    description:'hello there ( test 3)',
    startValue:40,
    stopValue:40,
    dimension: 'y'
  },

]

//const annotations = testAnnotations;

const ViewSwitcher: FunctionComponent<Props> = ({
  properties,
  timeRange,
  files,
  giraffeResult: {table, fluxGroupKeyUnion},
  timeZone,
  statuses,
  checkType = null,
  checkThresholds = [],
  theme,
  annotations,

}) => {
  switch (properties.type) {
    case 'single-stat':
      return (
        <LatestValueTransform table={table} allowString={true}>
          {latestValue => (
            <SingleStat
              stat={latestValue}
              properties={properties}
              theme={theme}
            />
          )}
        </LatestValueTransform>
      )

    case 'table':
      return (
        <FluxTablesTransform files={files}>
          {tables => (
            <TableGraphs
              tables={tables}
              properties={properties}
              timeZone={timeZone}
              theme={theme}
            />
          )}
        </FluxTablesTransform>
      )

    case 'gauge':
      return (
        <LatestValueTransform table={table} allowString={false}>
          {latestValue => (
            <GaugeChart
              value={latestValue}
              properties={properties}
              theme={theme}
            />
          )}
        </LatestValueTransform>
      )
    case 'xy':
      console.log("jill3-1: in xy plot of viewswitcher, annotations???", annotations)
        const actualAnns = annotations.length? annotations : []
      return (
        <XYPlot
          timeRange={timeRange}
          fluxGroupKeyUnion={fluxGroupKeyUnion}
          table={table}
          timeZone={timeZone}
          viewProperties={properties}
          theme={theme}
          annotations = {actualAnns}
        >
          {config => <Plot config={config} />}
        </XYPlot>
      )
    case 'band':
      return (
        <BandPlot
          timeRange={timeRange}
          fluxGroupKeyUnion={fluxGroupKeyUnion}
          table={table}
          timeZone={timeZone}
          viewProperties={properties}
          theme={theme}
        >
          {config => <Plot config={config} />}
        </BandPlot>
      )

    case 'line-plus-single-stat':
      const xyProperties = {
        ...properties,
        colors: properties.colors.filter(c => c.type === 'scale'),
        type: 'xy' as 'xy',
        geom: 'line' as 'line',
      } as XYViewProperties

      const singleStatProperties = {
        ...properties,
        tickPrefix: '',
        tickSuffix: '',
        colors: properties.colors.filter(c => c.type !== 'scale'),
        type: 'single-stat',
      } as SingleStatViewProperties

      return (
        <XYPlot
          timeRange={timeRange}
          fluxGroupKeyUnion={fluxGroupKeyUnion}
          table={table}
          timeZone={timeZone}
          viewProperties={xyProperties}
          theme={theme}
        >
          {config => (
            <Plot config={config}>
              <LatestValueTransform
                table={config.table}
                quiet={true}
                allowString={false}
              >
                {latestValue => (
                  <SingleStat
                    stat={latestValue}
                    properties={singleStatProperties}
                    theme={theme}
                  />
                )}
              </LatestValueTransform>
            </Plot>
          )}
        </XYPlot>
      )

    case 'histogram':
      return (
        <HistogramPlot
          table={table}
          timeZone={timeZone}
          viewProperties={properties}
          theme={theme}
        >
          {config => <Plot config={config} />}
        </HistogramPlot>
      )

    case 'heatmap':
      return (
        <HeatmapPlot
          timeRange={timeRange}
          table={table}
          timeZone={timeZone}
          viewProperties={properties}
          theme={theme}
        >
          {config => <Plot config={config} />}
        </HeatmapPlot>
      )

    case 'mosaic':
      return (
        <MosaicPlot
          timeRange={timeRange}
          table={table}
          timeZone={timeZone}
          viewProperties={properties}
          theme={theme}
        >
          {config => <Plot config={config} />}
        </MosaicPlot>
      )

    case 'scatter':
      return (
        <ScatterPlot
          timeRange={timeRange}
          table={table}
          viewProperties={properties}
          timeZone={timeZone}
          theme={theme}
        >
          {config => <Plot config={config} />}
        </ScatterPlot>
      )

    case 'geo':
      return (
        <GeoPlot table={table} viewProperties={properties}>
          {config => <Plot config={config} />}
        </GeoPlot>
      )

    case 'check':
      return (
        <CheckPlot
          checkType={checkType}
          thresholds={checkThresholds}
          table={table}
          fluxGroupKeyUnion={fluxGroupKeyUnion}
          timeZone={timeZone}
          viewProperties={properties}
          statuses={statuses}
        >
          {config => <Plot config={config} />}
        </CheckPlot>
      )

    default:
      throw new Error('Unknown view type in <ViewSwitcher /> ')
  }
}

export default ViewSwitcher
