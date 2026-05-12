export const getStyles = () => {
  const styles = {
    scrollBox: {
      height: '300px',       // Set the desired height
      overflowY: 'scroll',   // Enable vertical scrolling
      padding: '10px',
      border: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
    },
    codeBox: {
        // height: '300px',       // Set the desired height
        // overflowY: 'scroll',   // Enable vertical scrolling
        padding: '10px',
        border: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
      }
  }
  return styles;
}

export const groupPathsByTags = (paths) => {

    const grouped = {};

    for (const [path, methods, type] of Object.entries(paths)) {
      const { tags, summary, type } = methods.get;
      if (tags) {
        tags.forEach((tag) => {
          if (!grouped[tag]) {
            grouped[tag] = [];
          }
          grouped[tag].push({ path, summary, type });
        });
      }
    }

    return grouped;
};

export const getApiCall = (api) => {
  const params = api["get"]["parameters"].reduce((acc, info) => {
    if (info.required) {
      acc = info.example
    }
    return acc
  }, {});
  let path;
  if (api["path_parameters"]){
    path = api["path_parameters"]+params
  } else {
    path=api["path_display"]
  }
  return path
}

export const getParams = (api) => {

  const params = api["get"]["parameters"].reduce((acc, info) => {
    if (info.example & !info.required) {
        acc[info.name] = info.example;
    }
    return acc
  }, {});
  return params;

}

export const getParamsString = (params) => {


  const paramsString = Object.entries(params).map(([key, value], index) => {
    const indentation = index === 0 ? "" : "            "; 
    return `${indentation}"${key}": ${value}`; 

  }).join(",\n");

  return paramsString;
}

export const getPythonCode = (api) => {

  const params = getParams(api)

  const api_call = getApiCall(api)

  const paramsString = getParamsString(params)
  const code = 
  `
  import requests

  url = "${process.env.REACT_APP_URL}/api/${api_call}"

  headers = {
      "Content-Type": "application/json",
      'database': ${process.env.REACT_APP_DATABASE }
  }

  response = requests.get(url, headers=headers)

  print("Status code:", response.status_code)
  print("Response:", response.json())

  `;

  return code;
};

export const getRubyCode = (api) => {

  const params = getParams(api)

  const api_call = getApiCall(api)

  const paramsString = getParamsString(params)

  const code = 
  `require 'net/http'
  require 'uri'
          
  server="${process.env.REACT_APP_BACKEND_URL}"
  path = "${api_call}"

  ${Object.keys(params).length > 0 ? `params = {${paramsString}}` : ''}

  # Construct the full URL with query parameters
  url = URI.parse(server + path)
  ${Object.keys(params).length > 0 ? `url.query = URI.encode_www_form(params)` : ''}

  # Make the HTTP request
  http = Net::HTTP.new(url.host, url.port)
  request = Net::HTTP::Get.new(url, { 'Content-Type' => 'application/json' })

response = http.request(request)
  
  if response.code != "200"
      puts "Invalid response: #{response.code}"
      puts response.body
      exit
  end`

  return code
};

export const getJSCode = (api) => {

  const params = getParams(api)

  const api_call = getApiCall(api)

  const paramsString = getParamsString(params)
  const code = 
  `
  server = "${process.env.REACT_APP_URL}"
  api_call = "${api_call}"

  // Make a GET request
  fetch('${'server'}${'api_call'}, {
        headers: { 'database': ${process.env.REACT_APP_DATABASE }
        ${Object.keys(params).length > 0 ? ', params=params' : ''}})
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  `

  return code
};


export const getJavaCode = (api) => {
  const params = getParams(api)

  const api_call = getApiCall(api)

  const paramsString = getParamsString(params)
  const code = 
  `
import java.net.URL;
import java.net.URLConnection;
import java.net.HttpURLConnection;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.io.Reader;
 
 
public class VGBRest {
 
  public static void main(String[] args) throws Exception {
    String server = "${process.env.REACT_APP_BACKEND_URL}";
    String ext = "${api_call}";
    URL url = new URL(server + ext);
 
    URLConnection connection = url.openConnection();
    HttpURLConnection httpConnection = (HttpURLConnection)connection;
    
    httpConnection.setRequestProperty("Content-Type", "application/json");
    
 
    InputStream response = connection.getInputStream();
    int responseCode = httpConnection.getResponseCode();
 
    if(responseCode != 200) {
      throw new RuntimeException("Response code was not 200. Detected response was "+responseCode);
    }
 
    String output;
    Reader reader = null;
    try {
      reader = new BufferedReader(new InputStreamReader(response, "UTF-8"));
      StringBuilder builder = new StringBuilder();
      char[] buffer = new char[8192];
      int read;
      while ((read = reader.read(buffer, 0, buffer.length)) > 0) {
        builder.append(buffer, 0, read);
      }
      output = builder.toString();
    } 
    finally {
        if (reader != null) try {
          reader.close(); 
        } catch (IOException logOrIgnore) {
          logOrIgnore.printStackTrace();
        }
    }
 
    System.out.println(output);
  }
}
  `

  return code

}

export const getRCode = (api) => {
  const params = getParams(api)

  const api_call = getApiCall(api)

  const paramsString = getParamsString(params)

  const code = `
library(httr)
library(jsonlite)
library(xml2)
 
server <- "${process.env.REACT_APP_BACKEND_URL}}"
ext <- "${api_call}"
 
r <- GET(paste(server, ext, sep = ""), content_type("application/json"))
 
stop_for_status(r)
 
# use this if you get a simple nested list back, otherwise inspect its structure
# head(data.frame(t(sapply(content(r),c))))
head(fromJSON(toJSON(content(r))))
`

return code
}

export const getPerlCode = (api) => {
  const params = getParams(api)

  const api_call = getApiCall(api)

  const paramsString = getParamsString(params)

  const code = `
use strict;
use warnings;
 
use HTTP::Tiny;
 
my $http = HTTP::Tiny->new();
 
my $server = '${process.env.REACT_APP_BACKEND_URL}';
my $ext = '${api_call}';
my $response = $http->get($server.$ext, {
  headers => { 'Content-type' => 'application/json' }
});
 
die "Failed!\n" unless $response->{success};
 
 
use JSON;
use Data::Dumper;
if(length $response->{content}) {
  my $hash = decode_json($response->{content});
  local $Data::Dumper::Terse = 1;
  local $Data::Dumper::Indent = 1;
  print Dumper $hash;
  print "\n";
}
`

return code
}