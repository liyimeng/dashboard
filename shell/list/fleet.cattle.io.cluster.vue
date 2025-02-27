<script>
import FleetClusters from '@shell/components/fleet/FleetClusters';
import { FLEET, MANAGEMENT } from '@shell/config/types';
import { isHarvesterCluster } from '@shell/utils/cluster';
import { Banner } from '@components/Banner';
import ResourceFetch from '@shell/mixins/resource-fetch';

export default {
  name:       'ListCluster',
  components: { Banner, FleetClusters },
  mixins:     [ResourceFetch],
  props:      {
    resource: {
      type:     String,
      required: true,
    },
    schema: {
      type:     Object,
      required: true,
    },
    useQueryParamsForSimpleFiltering: {
      type:    Boolean,
      default: false
    }
  },

  async fetch() {
    await this.$store.dispatch('management/findAll', { type: FLEET.WORKSPACE });
    this.allMgmt = await this.$store.dispatch('management/findAll', { type: MANAGEMENT.CLUSTER });
    await this.$fetchType(FLEET.CLUSTER);
  },

  data() {
    return { allMgmt: [] };
  },

  computed: {
    allClusters() {
      const out = this.rows.slice();

      const known = {};

      for ( const c of out ) {
        known[c.metadata.name] = true;
      }

      for ( const c of this.allMgmt ) {
        if ( !known[c.metadata.name] ) {
          out.push(c);
        }
      }

      return out;
    },

    filteredRows() {
      return this.fleetClusters.filter(c => !isHarvesterCluster(c));
    },

    fleetClusters() {
      return this.allClusters.filter(c => c.type === FLEET.CLUSTER);
    },

    hiddenHarvesterCount() {
      return this.fleetClusters.length - this.filteredRows.length;
    },
  },
  // override with relevant info for the loading indicator since this doesn't use it's own masthead
  $loadingResources() {
    return {
      loadResources:     [FLEET.CLUSTER],
      loadIndeterminate: true, // results are filtered so we wouldn't get the correct count on indicator...
    };
  },
};
</script>

<template>
  <div>
    <Banner
      v-if="hiddenHarvesterCount"
      color="info"
      :label="t('fleet.clusters.harvester', {count: hiddenHarvesterCount} )"
    />
    <FleetClusters
      :rows="filteredRows"
      :schema="schema"
      :loading="loading"
      :use-query-params-for-simple-filtering="useQueryParamsForSimpleFiltering"
      :force-update-live-and-delayed="forceUpdateLiveAndDelayed"
    />
  </div>
</template>
