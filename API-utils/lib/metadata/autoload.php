<?php
/**
 * Library for grab website meta data.
 * @version 1.0.0
 * @author Fachri Riyanto
 */
class MetaData {
    /**
     * Get meta data.
     * @param string $url
     * @return json $metadat
     */
    function get($url) {
        if (empty($url)) {
            return array(
                'url'         => '',
                'domain'      => '',
                'title'       => '',
                'description' => '',
                'image'       => ''
            );
        }

        // get HTML from URL
        $html = $this->grabHTMLfromUrl($url);
        if (!$html) {
            return array(
                'url'         => $url,
                'domain'      => parse_url($url),
                'title'       => 'Something Error',
                'description' => 'Website is not found.',
                'image'       => '',
                'isImage'     => false
            );
            exit;
        }

        // validate if is image url
        $imagemeta = getimagesize($url);
        if ($imagemeta) {
            return array(
                'url'         => $url,
                'domain'      => parse_url($url),
                'title'       => 'Image Source',
                'description' => 'This is an image source.',
                'image'       => $url,
                'isImage'     => true,
                'imagemeta'   => array(
                    'width'  => $imagemeta[0],
                    'height' => $imagemeta[1],
                    'size'   => 0,
                    'url'    => $url,
                    'align'  => 'default'
                )
            );
            exit;
        }

        // get title
        if (strlen($html) > 0) {
            $html = trim(preg_replace('/\s+/', ' ', $html)); // supports line breaks inside <title>
            preg_match("/<title[^>]*>(.*?)<\/title>/ims", $html, $match); // ignore case
            $title = empty($match) ? 'No Title' : $match[1];
        } else {
            $title = 'No Title';
        }

        // get tags
        $tags = get_meta_tags($url);
        $tags = empty($tags) ? array(
            'description' => ''
        ) : $tags;
        // import image library
        require_once('image.php');
        $object = new Image;
        $image  = $object->getImage($html);
        // return data
        return array(
            'url'         => $url,
            'domain'      => parse_url($url),
            'title'       => $title,
            'description' => empty($tags['description']) ? '' : $tags['description'],
            'image'       => !$image ? '' : $image,
            'isImage'     => false
        );
        exit;
    }

    /**
     * Get HTML from website URL.
     * @param string $url Website URL.
     * @return string $html HTML tag.
     */
    function grabHTMLfromUrl($url) {
        $object = curl_init($url);
        curl_setopt($object, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($object, CURLOPT_HEADER, true);
        curl_setopt($object, CURLOPT_NOBODY, false);

        // get the status code
        $status = curl_getinfo($object, CURLINFO_HTTP_CODE);

        // get HTML
        $html = curl_exec($object);

        // close connection
        curl_close($object);

        return $html;
    }
}