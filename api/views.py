import requests
import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
# Replace with your private API URL

PRIVATE_API_BASE_URL = "http://gdb-dev.cvr.gla.ac.uk/api"
# PRIVATE_API_BASE_URL = "http://localhost:8001/api"

def proxy_get_download(endpoint, request=None, safe=True):
    """
    Helper to fetch from private API and return as JsonResponse
    - endpoint: path after base URL (e.g., 'sequences/')
    - request: optional Django request (to forward query params)
    - safe: set to False if returning list
    """
    try:
        query_string = request.GET.urlencode()

        url = f"{PRIVATE_API_BASE_URL}/{endpoint.lstrip('/')}"
        if query_string:
            url = f"{url}?{query_string}"

        response = requests.get(url, timeout=10)

        response.raise_for_status()

        # Return CSV file
        django_response = HttpResponse(
            response.content,
            content_type=response.headers.get(
                "Content-Type", "text/csv"
            )
        )

        django_response["Content-Disposition"] = "attachment; filename=meta_data.csv"

        return django_response

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def proxy_get(endpoint, request=None, safe=True):
    """
    Helper to fetch from private API and return as JsonResponse
    - endpoint: path after base URL (e.g., 'sequences/')
    - request: optional Django request (to forward query params)
    - safe: set to False if returning list
    """
    try:
        url = f"{PRIVATE_API_BASE_URL}/{endpoint.lstrip('/')}"
        if request:
            query_string = request.GET.urlencode()
            if query_string:
                url = f"{url}?{query_string}"

        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        # If API returns a list, safe=False is needed
        return JsonResponse(data, safe=safe)

    except requests.exceptions.RequestException as e:
        print(str(e))

        error_message = "Network/API error"

        if e.response is not None:
            try:
                error_json = e.response.json()
                error_message = error_json.get("error", str(e))
            except ValueError:
                error_message = str(e)

        return JsonResponse(
            {"error": error_message},
            status=e.response.status_code if e.response else 500
        )

    except ValueError as e:
        # JSON decode error
        return JsonResponse({"error": f"Invalid JSON from API: {str(e)}"}, status=500)

def proxy_post(endpoint, request):
    try:
        url = f"{PRIVATE_API_BASE_URL}/{endpoint}"

        response = requests.post(
            url,
            json=json.loads(request.body),
        )

        response.raise_for_status()

        return JsonResponse(response.json(), safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def api_sequences(request):
    return proxy_get("sequences/", request)

def api_sequence(request, seq_id):
    return proxy_get(f"sequence/{seq_id}", request)

def api_sequence_reference(request, seq_id):
    return proxy_get(f"sequence/reference/{seq_id}", request)

def api_taxonomy(request, taxa_level):
    return proxy_get(f"taxonomy/{taxa_level}", request, safe=False)

def api_phylogeny_tree(request):
    return proxy_get("phylogeny/tree/", request)

def api_sequences_global(request):
    return proxy_get("sequences/global/", request, safe=False)

def api_lineages(request):
    return proxy_get("lineages/", request, safe=False)

def api_host_mutation(request, segment):
    return proxy_get("adaptive_mutations_chart/", request)

def api_search_primary_accession(request, query):
    return proxy_get(f"filters/search_primary_accession_ids/{query}", request, safe=False)

def api_search_isolate_ids(request, query):
    return proxy_get(f"filters/search_isolate_ids/{query}", request, safe=False)

def api_search_hosts(request, query):
    return proxy_get(f"filters/search_hosts/{query}", request, safe=False)

def api_search_country(request, query):
    return proxy_get(f"filters/search_country/{query}", request, safe=False)

def api_version(request):
    return proxy_get(f"get_vgt_version/", request, safe=False)

def api_download_sequences_meta_data(request):
    return proxy_get_download(f"sequences/download_sequences_meta_data/", request, safe=False)

def api_download_alignments(request):
    return proxy_get_download(f"alignments/download", request, safe=False)

@csrf_exempt
@require_POST
def api_analysis_clade_assignment(request):
    return proxy_post(f"analysis/clade_assignment/", request)