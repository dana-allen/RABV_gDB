from django.urls import path, include
from .views import *

urlpatterns = [

    # path("", home, name="home"),
    path('sequence/<str:seq_id>', api_sequence, name='api_sequence'),
    path('sequences/', api_sequences, name='api_sequences'),

    path('sequence/reference/<str:seq_id>', api_sequence_reference, name='api_sequence_reference'),

    path('phylogeny/tree/', api_phylogeny_tree, name='api_phylogeny_tree'),
    path('taxonomy/<str:taxa_level>', api_taxonomy, name='api_taxonomy'),

    path('sequences/global/', api_sequences_global, name='api_sequences_global'),
    path('lineages/', api_lineages, name='api_lineages'),
    path('host_mutation/<str:seqment>', api_host_mutation, name='api_host_mutation'),

    path('filters/search_primary_accession_ids/<str:query>', api_search_primary_accession, name='api_search_primary_accession'),
    path('filters/search_isolate_ids/<str:query>', api_search_isolate_ids, name='api_search_isolate_ids'),
    path('filters/search_hosts/', api_search_hosts, name='api_search_hosts'),
    path('filters/search_m49_code/', api_search_country, name='api_search_country'),
    path('filters/search_m49_intermediate_region_id/', api_search_m49_intermediate, name='search_m49_intermediate'),
    path('filters/search_m49_region_id/', api_search_m49_region, name='search_m49_region'),
    path('filters/search_m49_sub_region_id/', api_search_m49_sub_region, name='search_m49_sub_region'),

    path('sequences/download_sequences_meta_data/', api_download_sequences_meta_data, name='api_download_sequences_meta_data'),
    path('alignments/download', api_download_alignments, name='api_download_alignments'),

    path('analysis/clade_assignment/', api_analysis_clade_assignment, name='api_analysis_clade_assignment'),

    path('version', api_version, name='api_version'),
    
]
