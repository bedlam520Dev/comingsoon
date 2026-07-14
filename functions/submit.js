export async function onRequestPost(context) {
	try {
		const { request, env } = context;
		const contentType = request.headers.get('content-type') || '';

		let email = '';

		if (contentType.includes('application/json')) {
			const body = await request.json();
			email = body.email;
		} else {
			const formData = await request.formData();
			email = formData.get('email');
		}

		if (!email || !email.includes('@')) {
			return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		await env.EMAIL.send({
			to: 'jaynjaymovers503@gmail.com',
			from: 'notify@jaynjaymovers.com',
			subject: 'New Lead Capture Submission!',
			html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>New Coming Soon Signup!</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Timestamp:</strong> ${new Date().toUTCString()}</p>
        </div>
      `,
			text: `New Coming Soon Signup!\n\nEmail: ${email}\nTimestamp: ${new Date().toUTCString()}`,
		});

		return new Response(
			JSON.stringify({ message: 'Success! You have been subscribed.' }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch {
		return new Response(
			JSON.stringify({ error: 'Server error. Please try again later.' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
